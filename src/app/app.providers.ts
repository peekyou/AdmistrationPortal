import { HttpService } from './core/services/http.service';
import { AuthHttpService } from './core/services/auth-http.service';
import { CountrySelectService } from './core/shared/components/country-select/country-select.service';
import { TranslationService } from './core/services/translation.service';
import { UserService } from './components/user/user.service';
import { ContentEditorService } from './components/content-editor/content-editor.service'
import { CustomerService } from './components/customer/customer.service';
import { PromotionService } from './components/promotion/promotion.service';
import { ReviewService } from './components/review/review.service';
import { SmsService } from './components/sms/sms.service';
import { BillingService } from './components/billing/billing.service';
import { UserManagementService } from './components/user-management/user-management.service';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PendingChangesGuard } from './guards/pending-changes.guard';

export const APP_PROVIDERS = [
    HttpService,
    AuthHttpService,
    CountrySelectService,
    TranslationService,
    UserService,
    ContentEditorService,
    CustomerService,
    PromotionService,
    ReviewService,
    SmsService,
    BillingService,
    UserManagementService,
    AuthGuard,
    PermissionGuard,
    PendingChangesGuard
];