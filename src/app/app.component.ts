import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Observable, interval, fromEvent, merge, NEVER, of } from "rxjs";
import { switchMap, map, mapTo, startWith, tap } from "rxjs/operators";

export type stateLevel = "start" | "pause" | "stop";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  display$: Observable<string>;

  @ViewChild("btnStart") btnStart: ElementRef<HTMLButtonElement>;
  @ViewChild("btnStop") btnStop: ElementRef<HTMLButtonElement>;
  @ViewChild("btnPause") btnPause: ElementRef<HTMLButtonElement>;

  ngOnInit() {
    // start button
    const start$ = fromEvent(this.btnStart.nativeElement, "click");
    const stop$ = fromEvent(this.btnStop.nativeElement, "click");
    const pause$ = fromEvent(this.btnPause.nativeElement, "click");
    const zero = (0).toFixed(2);

    let currenValue = 0;
    const timer$ = interval(1000).pipe(
      tap((x) => {
        currenValue = x;
      }),
      map((x) => x / 100),
      map((x) => x.toFixed(2))
    );

    // start button
    const btnStart$ = start$.pipe(mapTo("start"));
    const btnPause$ = pause$.pipe(mapTo("pause"));
    const btnStop$ = stop$.pipe(mapTo("stop"));

    // start timer
    this.display$ = merge(btnPause$, btnStart$, btnStop$)
      .pipe(
        switchMap(
          (label: stateLevel): Observable<string> => {
            switch (label) {
              case "start":
                return timer$;
              case "pause":
                return NEVER;
              case "stop":
                return of(zero);
            }
          }
        )
      )
      .pipe(startWith(zero));
  }
}
