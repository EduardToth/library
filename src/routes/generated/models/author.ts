/* tslint:disable */
/* eslint-disable */
/**
 * JSON Placeholder API
 * See https://jsonplaceholder.typicode.com/
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Book } from './book';

/**
 * 
 * @export
 * @interface Author
 */
export interface Author {
    /**
     * 
     * @type {string}
     * @memberof Author
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof Author
     */
    'name': string;
    /**
     * 
     * @type {Array<Book>}
     * @memberof Author
     */
    'booksWritten': Array<Book>;
}

