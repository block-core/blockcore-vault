"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function syncInterval(arg) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('API interval run.');
        setTimeout((arg) => {
            syncInterval(arg);
        }, 10000, 'funky');
    });
}
// setTimeout((arg) => {
//     syncInterval(arg);
// }, 5000, 'argument');
syncInterval(null);