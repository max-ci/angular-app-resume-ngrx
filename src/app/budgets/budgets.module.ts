import { NgModule } from '@angular/core';
import { BudgetsComponent } from './budgets.component';
import { BudgetsListComponent } from './budgets-list/budgets-list.component';
import { BudgetDetailsComponent } from './budget-details/budget-details.component';
import { SharedModule } from '../shared/modules/shared.module';
import { StoreModule } from '@ngrx/store';
import { budgetsReducer } from '../shared/state/reducers/budget.reducer';
import { BudgetEffects } from '../shared/state/effects/budget.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    BudgetsComponent,
    BudgetsListComponent,
    BudgetDetailsComponent,
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('budgets', budgetsReducer),
    EffectsModule.forFeature([BudgetEffects]),
  ],
})
export class BudgetsModule {}
