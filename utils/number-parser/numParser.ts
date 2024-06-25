import {
    isValidPhoneNumber,
    parsePhoneNumberFromString,
    PhoneNumber,
  } from 'libphonenumber-js';
  
  interface PhoneNumberData {
    country: string;
    countryCallingCode: string;
    nationalNumber: string;
    carrierCode: string | number | null;
    extension: string | number | null;
    numberOfLeadingZeros: number;
    rawInput: string;
    international: string;
    national: string;
    e164: string;
    uri: string;
  }
  
  function isValidNumber(number: string): boolean | string | Partial<PhoneNumberData> {
    if (!isValidPhoneNumber(number)) {
      throw new Error('Invalid phone number');
    } else {
      const phoneNumber = parsePhoneNumberFromString(number);
      if (phoneNumber) {
        if (phoneNumber.country!== 'KE') {
          return "Country is currently not supported";
        }
        // Return the phone number object without the metadata property
        const phoneNumberData: { [key: string]: any } = {};
        for (const key in phoneNumber) {
          if (key!== "metadata" && typeof phoneNumber[key]!== 'function') {
            const propertyType = key as keyof PhoneNumberData;
            phoneNumberData[propertyType] = phoneNumber[key] as PhoneNumberData[keyof PhoneNumberData];
          }
        }
        return phoneNumberData;
      }
    }
    return false; // Return false if the phone number could not be parsed
  }
  
  export default isValidNumber;