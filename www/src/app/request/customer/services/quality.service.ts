import { Injectable } from '@angular/core';
import { RequestPositionList } from "../../common/models/request-position-list";
import { RequestPosition } from "../../common/models/request-position";
import { RequestGroup } from "../../common/models/request-group";
import { RequestPositionWorkflowSteps } from "../../common/enum/request-position-workflow-steps";
import { Uuid } from "../../../cart/models/uuid";

@Injectable()
export class QualityService {
  private readonly storageKey = 'positionsIdsWithQualityRating';

  public getCompletedWithoutQualityRating(requestPositionsList: RequestPositionList[]) {
    return this.getFlatRequestPositions(requestPositionsList).filter(position =>
      position.status === RequestPositionWorkflowSteps.COMPLETED &&
      this.positionsIdsWithQualityRating.filter(id => id === position.id).length === 0
    );
  }

  public addPositionIdWithQualityRating(positions: RequestPosition[]): void {
    const positionIds = new Set(this.positionsIdsWithQualityRating);
    positions.forEach(position => positionIds.add(position.id));

    localStorage.setItem(this.storageKey, JSON.stringify([...positionIds]));
  }

  // Возвращает все позиции включая вложенные в группы одним уровнем
  private getFlatRequestPositions(requestPositionsList: RequestPositionList[]): RequestPosition[] {
    return requestPositionsList.reduce(
      function flatPositionList(arr, curr: RequestPositionList) {
        if (curr instanceof RequestGroup) {
          return flatPositionList(curr.positions, null);
        }

        return [...arr, curr].filter(Boolean);
      }, []);
  }

  private get positionsIdsWithQualityRating(): Uuid[] {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }
}
