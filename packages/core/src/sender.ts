import { BatchSender, SenderConfig } from '@monitorjs/types';
import { isFunction } from '@monitorjs/shared';
import { DEFAULT_SEND_SIZE, DEFAULT_SEND_WAIT } from './constant';

/*
 * @description 批量上报
 *
 * @export
 * @class Sender
 * @implements {BatchSender<T>}
 * @template T
 * */
export class Sender<T> implements BatchSender<T> {
  /**
   * 上报 url
   */
  public endpoint: string = '';
  /**
   * 发送个数限制，达到数量限制立即发送
   */
  public size: number;
  /**
   * 最长等待时长，超过时长立即发送
   */
  public wait: number;
  /**
   * 批量发送数组
   */
  private batch: T[] = [];
  /**
   * 上报方法
   */
  private transport: (options: any) => void;
  private tid: number = 0;

  public constructor(options?: SenderConfig) {
    const { size, wait, endpoint, transport } = options || { transport: () => {} };

    if (!endpoint) {
      throw new Error('Sender Error]: endpoint is not defined!');
    }

    if (!isFunction(transport)) {
      throw new Error('Sender Error]: transport must be an function!');
    }

    this.size = size || DEFAULT_SEND_SIZE;
    this.wait = wait || DEFAULT_SEND_WAIT;
    this.endpoint = endpoint;
    this.batch = [];

    this.transport = transport;
  }

  public getSize(): number {
    return this.size;
  }
  public setSize(v: number): void {
    this.size = v;
  }
  public getWait(): number {
    return this.wait;
  }

  public setWait(v: number): void {
    this.wait = v;
  }
  public getEndpoint(): string {
    return this.endpoint;
  }

  public setEndpoint(v: string): void {
    this.endpoint = v;
  }

  public send(e: T): void {
    this.batch.push(e);

    if (this.batch.length >= this.size) {
      // 上报数据
      this.sendBatchData();
    }
    clearTimeout(this.tid);
    this.tid = setTimeout(this.sendBatchData.bind(this), this.wait);
  }

  public flush(): void {
    clearTimeout(this.tid);
    this.sendBatchData.call(this);
  }

  public clear(): void {
    clearTimeout(this.tid);
    this.batch = [];
  }

  public getBatchData(): string {
    return this.batch.length
      ? JSON.stringify(
          this.batch.length === 1
            ? this.batch[0]
            : {
                ev_type: 'batch',
                list: this.batch,
              }
        )
      : '';
  }

  public sendBatchData(): void {
    if (!this.batch.length) {
      return;
    }

    console.log(this.endpoint, this.getBatchData())

    // this.transport({ url: this.endpoint, data: this.getBatchData() });

    this.batch = [];
  }
}
