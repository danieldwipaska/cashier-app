export default class Randomize {
  static generateReportId(action: string, length: number): string {
    const date = new Date();

    let randomString = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return `${action}-${date.getFullYear()}.${date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth()}.${date.getDate()}-${randomString}`;
  }
}
