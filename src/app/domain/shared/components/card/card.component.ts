import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "eda-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaCard {
  @Input() class: string = "";
  @Input() hasTopLine: boolean = true;
  @Input() topLineClass: string = "";
  @Input() topLineColor: string = "";
  @Input() style: string = "";
  constructor() {}
}
