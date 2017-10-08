import { ControlValueAccessor } from '@angular/forms';
import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { Log } from '../log.service';

// const SELECTOR_VALUE_ACCESSOR = new Provider(NG_VALUE_ACCESSOR, {
//   useExisting: forwardRef(() => SelectorComponent),
//   multi: true
// });

@Component({
  moduleId: module.id,
  selector: 'app-selector',
  templateUrl: 'selector.component.html',
  styleUrls: ['selector.component.css'],
  // providers: [SELECTOR_VALUE_ACCESSOR]
})

export class SelectorComponent implements ControlValueAccessor, OnInit, OnChanges {

  @Input() disabled = false;
  @Input() selected: any;
  @Input() items: Item[];
  @Input() multi = false;

  _onChangeCallback: (_: any) => void;
  _selected: Item[] = [];

  registerOnChange(fn: any) {
    const values = this._getValues();
    this._onChangeCallback = fn;
    this._onChangeCallback(this.multi ? values : values[0]);
  }

  registerOnTouched(fn: any) {
    // Empty
  }

  writeValue(value: any) {
    // Empty
  }

  _isThereItem(): boolean {
    return Array.isArray(this.items) && this.items.length > 0;
  }

  _getItemByValue(itemValue: any): Item {
    return this._isThereItem() ? this.items.filter((item: any) => item.value === itemValue)[0] : <Item> {};
  }

  _getSelectedItem(): Item {
    return this._selected[0] ? this._selected[0] : <Item> {};
  }

  _getValues(): string[] {
    const values: string[] = this._selected.map((item: any) => item.value);
    return values.length > 0 ? values : [];
  }

  _isSelected(item: Item): boolean {
    return this._selected.filter((itm: any) => itm.value === item.value).length > 0;
  }

  _prevent(event: any) {
    event.stopPropagation();
  }

  _select(item: Item, event: any) {
    Log.debug('SelectorComponent->_select()');

    if (this.multi && !this._isSelected(item)) {
      this._selected.push(item);
      this._onChangeCallback(this._getValues());
    } else if (!this.multi) {
      this._selected = [item];
      this._onChangeCallback(item.value);
    }

    event.preventDefault();
  }

  _unselect(index: number) {
    Log.debug('SelectorComponent->_unselect()');

    this._selected.splice(index, 1);
    this._onChangeCallback(this._getValues());

    event.stopPropagation();
  }

  ngOnChanges() {
    if (!this.multi && this.selected !== this._getSelectedItem().value) {
      this._selected = [this._getItemByValue(this.selected)];
    }
  }

  ngOnInit() {
    Log.debug('SelectorComponent->ngOnInit()');

    if (this._isThereItem()) {
      if (!this.multi) {
        this._selected = [this.selected ? this._getItemByValue(this.selected) : <Item> this.items[0]];
      } else if (Array.isArray(this.selected)) {
        this._selected = this.selected.map((itemValue: any) => this._getItemByValue(itemValue));
      }
    }
  }
}

interface Item {
  caption: string;
  value: string;
}
