// convert a fraction string to a floating-point integer
const convertFraction = (number: string) => {
    // split the number by spaces and forward slashes
    const numArray = number.split(/ |\//);

    let integer = 0;
    let divisor = 0;
    let dividend = 0;

    // integer only (i.e. 1)
    if (numArray.length == 1) {
        integer = Number(numArray[0]);
        divisor = 0;
        dividend = 0;
    }
    // fraction only (i.e. 1/2)
    if (numArray.length == 2) {
        integer = 0;
        divisor = Number(numArray[0]);
        dividend = Number(numArray[1]);
    }
    // integer and fraction (i.e. 1 1/2)
    if (numArray.length == 3) {
        integer = Number(numArray[0]);
        divisor = Number(numArray[1]);
        dividend = Number(numArray[2]);
    }

    let pointNum = integer;

    // don't divide by zero! doom!!
    if (numArray.length > 1) {
        pointNum += divisor / dividend;
    }

    return pointNum;
};

export default convertFraction;
