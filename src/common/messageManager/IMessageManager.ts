export default interface IMessageManager {
  addListener(listener: any): void;

  removeListener(listener: any): void;
}
