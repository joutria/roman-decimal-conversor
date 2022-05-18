import { createSlice } from '@reduxjs/toolkit'


// Hash table for converting roman numerals to decimal
class hashTable{
  constructor(length){
    this.length = length;
    this.data = new Array(length);
  }

  _hash(key){
    let hash = 0;

    for(let i = 0; i < key.length; i++){
      hash = (hash + key.charCodeAt(i) * i) % this.data.length;
    }

    return hash;
  }

  // Set method for hash table with collision handling
  set(key, value){
    let address = this._hash(key);
    let currentBucket = this.data[address];

    if(currentBucket === undefined){
      this.data[address] = [ [key, value] ];
    }
    else{
      for(let i = 0; i < currentBucket.length; i++){
        if(currentBucket[i][0] === key){
          currentBucket[i][1] = value;
          return;
        }
      }

      currentBucket.push([key, value]);
    }
  }

  // Get method for hash table with collision handling
  get(key){
    let address = this._hash(key);
    let currentBucket = this.data[address];

    if(currentBucket.length > 0){
      for(let i = 0; i < currentBucket.length; i++){
        if(currentBucket[i][0] === key){
          return currentBucket[i][1];
        }
      }
    }

    return undefined;
  }

  // Remove method for hash table with collision handling
  remove(key){
    let address = this._hash(key);
    let currentBucket = this.data[address];

    if(currentBucket.length > 0){
      for(let i = 0; i < currentBucket.length; i++){
        if(currentBucket[i][0] === key){
          currentBucket.splice(i, 1);
          return;
        }
      }
    }
  }

  // Print method for hash table
  print(){
    for(let i = 0; i < this.data.length; i++){
      console.log(i + ": " + this.data[i]);
    }
  }

  // Clear method for hash table
  clear(){
    this.data = new Array(this.length);
  }

  // Get keys method for hash table
  getKeys(){
    let keys = [];

    for(let i = 0; i < this.data.length; i++){
      if(this.data[i] !== undefined){
        for(let j = 0; j < this.data[i].length; j++){
          keys.push(this.data[i][j][0]);
        }
      }
    }

    return keys;
  }

  //Initialize hash table with roman numerals
  init(){
    this.set('I', 1);
    this.set('IV', 4);
    this.set('V', 5);
    this.set('IX', 9);
    this.set('X', 10);
    this.set('XL', 40);
    this.set('L', 50);
    this.set('XC', 90);
    this.set('C', 100);
    this.set('CD', 400);
    this.set('D', 500);
    this.set('CM', 900);
    this.set('M', 1000);
  }
}

export const convertSlice = createSlice({
  name: 'convert',
  initialState: {
    value: '',
  },
  reducers: {
    // Convert a roman numeral to decimal using the hash table values
    romanToDecimal: (state, input) => {
      let payload = input.payload;
      let value = 0;
      let table = new hashTable(10);
      table.init();

      for(let i = 0; i < payload.length; i++){
        let current = payload[i];
        let next = payload[i + 1];

        if(next !== undefined && table.get(current) < table.get(next)){
          value -= table.get(current);
        }
        else{
          value += table.get(current);
        }
      }

      state.value = value;
    },
    // Convert a decimal number to roman numerals using the hash table values
    decimalToRoman: (state, input) => {
      let payload = input.payload;
      let value = payload;
      let table = new hashTable(10);
      table.init();
      let roman = '';
      
      while(value > 0){
        let keys = table.getKeys();
        let max = 0;
        let maxKey = '';

        for(let i = 0; i < keys.length; i++){
          if(table.get(keys[i]) <= value && table.get(keys[i]) > max){
            max = table.get(keys[i]);
            maxKey = keys[i];
          }
        }

        value -= max;
        roman += maxKey;
      }

      state.value = roman;
    }
  },
})

export const { romanToDecimal, decimalToRoman } = convertSlice.actions

export default convertSlice.reducer