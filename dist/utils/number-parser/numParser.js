"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libphonenumber_js_1 = require("libphonenumber-js");
function isValidNumber(number) {
    if (!(0, libphonenumber_js_1.isValidPhoneNumber)(number)) {
        throw new Error('Invalid phone number');
    }
    else {
        const phoneNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(number);
        if (phoneNumber) {
            if (phoneNumber.country !== 'KE') {
                return "Country is currently not supported";
            }
            // Return the phone number object without the metadata property
            const phoneNumberData = {};
            for (const key in phoneNumber) {
                if (key !== "metadata" && typeof phoneNumber[key] !== 'function') {
                    const propertyType = key;
                    phoneNumberData[propertyType] = phoneNumber[key];
                }
            }
            return phoneNumberData;
        }
    }
    return false; // Return false if the phone number could not be parsed
}
exports.default = isValidNumber;
//# sourceMappingURL=numParser.js.map