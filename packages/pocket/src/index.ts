type Provider = {
  url: string;
};

export class Pocket {
  private provider: Provider;

  public static hi() {
    console.log("gm");
  }
}
