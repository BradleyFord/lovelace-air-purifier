import { html } from 'lit-element';

export const styles = html`
  <style>
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    ha-card {
      background-color: #36455f;
      // background: #36435d;
      flex-direction: column;
      flex: 1;
      position: relative;
      padding: 0px;
      border-radius: 4px;
      overflow: hidden;
    }
    .preview {
      background: transparent no-repeat center url('/local/air_purifier/working.gif');
      height: 220px;
      background-size: 280px 280px;
      display: flex;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .preview.idle {
      background-image: url('/local/air_purifier/standby.gif');
      background-size: 280px 280px;
    }
    .current-aqi {
      font-size: 48px;
      font-weight: bold;
      align-self: center;
      line-height: 48px;
      padding: 5px 10px;
      border-radius: 2px;
      background: rgba(0, 0, 0, 0);
      color: rgba(255, 255, 255, 1);
    }
    .current-aqi sup {
      font-size: 16px;
      line-height: 16px;
      font-weight: normal;
      color: rgba(255, 255, 255, 1);
    }
    .number-off {
      opacity: 0.2;
    }
    .toolbar {
      background: #fff;
      min-height: 30px;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      padding: 0px;
    }
    .stats {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      color: rgba(255, 255, 255, 1);
    }
    .stats-block {
      margin: 10px 0px;
      text-align: center;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      flex-grow: 1;
      color: rgba(255, 255, 255, 1);
    }
    .stats sup {
      color: rgba(255, 255, 255, 1);
    }
    .stats-block:last-child {
      border: 0px;
    }
    .stats-hours {
      font-size: 20px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }
    .toolbar ha-icon-button {
      color: #319ef9;
      flex-direction: column;
      width: 44px;
      height: 54px;
      padding-right: 10px;
    }
    .toolbar ha-icon-button:active {
      opacity: 0.4;
      background: rgba(0, 0, 0, 0.1);
    }
    .toolbar ha-icon-button:last-child {
      margin-right: 0px;
    }
    .toolbar ha-button {
      color: #319ef9;
      flex-direction: row;
    }
    .toolbar ha-icon {
      color: #319ef9;
      padding-right: 15px;
    }
    .toolbar-split {
      padding-right: 15px;
    }
    .toolbar-item {
      opacity: 0.5;
    }
    .toolbar-item-on {
      opacity: 1;
    }
  </style>
`;

export default styles;
