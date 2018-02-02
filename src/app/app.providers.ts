import { HttpService } from './core/services/http.service';
import { AuthHttpService } from './core/services/auth-http.service';
import { CountryPickerService } from './core/shared/components/country-picker/country-picker.service';
import { LanguagePickerService } from './core/shared/components/language-picker/language-picker.service';
import { TranslationService } from './core/services/translation.service';
import { UserService } from './components/user/user.service';
import { ContentEditorService } from './components/content-editor/content-editor.service'
import { CustomerService } from './components/customer/customer.service';
import { PromotionService } from './components/promotion/promotion.service';
import { ReviewService } from './components/review/review.service';
import { SmsService } from './components/sms/sms.service';
import { BillingService } from './components/billing/billing.service';
import { UserManagementService } from './components/user-management/user-management.service';
import { StatsService } from './components/stats/stats.service';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PendingChangesGuard } from './guards/pending-changes.guard';

export const APP_PROVIDERS = [
    HttpService,
    AuthHttpService,
    CountryPickerService,
    LanguagePickerService,
    TranslationService,
    UserService,
    ContentEditorService,
    CustomerService,
    PromotionService,
    ReviewService,
    SmsService,
    BillingService,
    UserManagementService,
    StatsService,
    AuthGuard,
    PermissionGuard,
    PendingChangesGuard
];