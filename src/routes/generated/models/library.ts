/* tslint:disable */
/* eslint-disable */
/**
 * LibraryAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { BookShelf } from './book-shelf';

/**
 * 
 * @export
 * @interface Library
 */
export interface Library {
    /**
     * 
     * @type {string}
     * @memberof Library
     */
    'name'?: string;
    /**
     * 
     * @type {Array<BookShelf>}
     * @memberof Library
     */
    'bookShelves'?: Array<BookShelf>;
}

