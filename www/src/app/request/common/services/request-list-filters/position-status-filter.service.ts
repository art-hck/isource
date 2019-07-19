// import {Injectable} from "@angular/core";
// import {ClrDatagridStringFilterInterface} from "@clr/angular";
// import {RequestsList} from "../../models/requests-list/requests-list";
//
//
// @Injectable()
// export class PositionStatusFilter implements ClrDatagridStringFilterInterface<RequestsList> {
//   accepts(request: RequestsList, search: string): boolean {
//     if (search.length === 0) {
//       return true;
//     }
//     if (!request.positions || request.positions.length === 0) {
//       return false;
//     }
//     for (let index = 0; index < request.positions.length; index++) {
//       const position = request.positions[index];
//       if (
//         position.status.label === search ||
//         position.status.label.toLowerCase().indexOf(search.toLowerCase()) >= 0
//       ) {
//         return true;
//       }
//     }
//     return false;
//   }
// }
