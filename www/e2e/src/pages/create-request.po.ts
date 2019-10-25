import {by, element} from "protractor";

export class CreateRequestPage {
  public static downloadLink() {
    return element(by.linkText('шаблон'));
  }
}
