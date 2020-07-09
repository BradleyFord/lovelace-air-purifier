import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
  LovelaceCard,
} from 'custom-card-helpers';

import './editor';

import { AirPurifierCardConfig } from './types';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';
import { styles } from './styles';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  AirPurifier-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'airpurifier-card',
  name: 'AirPurifier Card',
  description: 'A card that visualises the state of your Xiaomi Air Purifier',
});

// Name of the custom element
@customElement('airpurifier-card')
export class AirPurifierCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('airpurifier-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  @property() public hass!: HomeAssistant;
  @property() private config!: AirPurifierCardConfig;

  //entityId = this._config.entity;
  public entity!: any;

  public setConfig(config: AirPurifierCardConfig): void {
    // TODO Check for required fields and that they are of the proper formatw
    if (!config || config.show_error) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (!config.entity) {
      throw new Error('Please define a Air Purifier entity');
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'AirPurifier',
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  handleMore() {
    const e = new Event('hass-more-info', { bubbles: true, composed: true });
    //e.detail = { entityId: this.entity.entity_id };
    this.dispatchEvent(e);
  }

  handleSpeed(e) {
    const fan_speed = e.target.getAttribute('value');
    this.callService('set_fan_speed', {
      fan_speed,
    });
  }

  callService(service, options = {}) {
    this.hass.callService('fan', service, {
      entity_id: this.config.entity,
      ...options,
    });
  }

  callXiaomiService(service, options = {}) {
    this.hass.callService('xiaomi_miio', service, {
      entity_id: this.config.entity,
      ...options,
    });
  }

  //renderAQI(aqi) {
  //  let prefix = '';
  //  if (aqi < 10) {
  //    prefix = html`
  //      <span class="number-off">00</span>
  //    `;
  //  } else if (aqi < 100) {
  //    prefix = html`
  //      <span class="number-off">0</span>
  //    `;
  //  }
  //  return html`
  //    ${prefix}<span class="number-on">${aqi}</span>
  //  `;
  //}

  renderStats() {
    const {
      attributes: { filter_life_remaining, motor_speed },
    } = this.entity;

    return html`
      <div class="stats-block">
        <span class="stats-hours">${filter_life_remaining}</span> <sup>%</sup>
        <div class="stats-subtitle">Filter remaining</div>
      </div>
      <div class="stats-block">
        <span class="stats-hours">${motor_speed}</span> <sup>RPM</sup>
        <div class="stats-subtitle">Motor speed</div>
      </div>
    `;
  }

  setFavorite(level) {
    this.callService('turn_on');
    setTimeout(() => {
      this.callService('set_speed', { speed: 'Favorite' });
    }, 500);
    setTimeout(() => {
      this.callXiaomiService('fan_set_favorite_level', { level });
    }, 1000);
  }

  renderToolbar() {
    //const {
    //  state,
    //  attributes: { favorite_level, mode },
    //} = this.entity;

    return html`
      <div class="toolbar">
        <ha-icon-button icon="mdi:power-standby" title="Power"> </ha-icon-button>
        <div class="fill-gap"></div>
        <ha-icon-button icon="mdi:weather-night" title="Sleep"> </ha-icon-button>
        <ha-icon-button icon="mdi:circle-slice-3" title="30%"> </ha-icon-button>
        <ha-icon-button icon="mdi:circle-slice-4" title="50%"> </ha-icon-button>
        <ha-icon-button icon="mdi:circle-slice-6" title="70%"> </ha-icon-button>
        <ha-icon-button icon="mdi:circle-slice-8" title="100%"> </ha-icon-button>
        <ha-icon-button icon="mdi:brightness-auto" title="Auto"> </ha-icon-button>
      </div>
    `;
  }

  protected render(): TemplateResult | void {
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this.showWarning(localize('common.show_warning'));
    }

    return html`
      <ha-card
        .header=${this.config.name}
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this.config.hold_action),
          hasDoubleClick: hasAction(this.config.double_tap_action),
        })}
        tabindex="0"
        aria-label=${`AirPurifier: ${this.config.entity}`}
      >
        <div class="preview ${'off' && 'idle'}">
          <div class="current-aqi">
            <sup>AQI</sup>
          </div>
        </div>
        <div class="stats">${this.renderStats()}</div>
        ${this.renderToolbar()}
      </ha-card>
      ${styles}
    `;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  private showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card') as LovelaceCard;
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`
      ${errorCard}
    `;
  }

  static get styles(): CSSResult {
    return css``;
  }
}
