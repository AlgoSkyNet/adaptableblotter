

export interface ISearchService {
  
  ApplySearchOnGrid(): void 

   ApplySearchOnRow(rowIdentifier: any): void

    ApplySearchOnUserFilter(userFilterIds: string[]):void
    

}