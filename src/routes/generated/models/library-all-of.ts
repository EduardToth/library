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
 * @interface LibraryAllOf
 */
export interface LibraryAllOf {
    /**
     * 
     * @type {string}
     * @memberof LibraryAllOf
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof LibraryAllOf
     */
    'name'?: string;
    /**
     * 
     * @type {Array<BookShelf>}
     * @memberof LibraryAllOf
     */
    'bookShelves': Array<BookShelf>;
}

