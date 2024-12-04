/**
 * Get the maximum value in an array.
 * @param {Array[number]} numberArray an array of numbers
 * @returns the maximum value or -Infinity
 */
export const getMaxInArray = (numberArray) => {

  let maximumValue = -Infinity;
  
  for (let numberIndex = 0; numberIndex < numberArray.length; numberIndex++) {
    
    if ((typeof numberArray[numberIndex] === 'number')
      && (numberArray[numberIndex] > maximumValue)) {
      maximumValue = numberArray[numberIndex];
    }
  }

  return maximumValue;
}
