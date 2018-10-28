import { HttpService } from './core/services/http.service';
import { AuthHttpService } from './core/services/auth-http.service';
import { LookupService } from './core/services/lookup.service';
import { TranslationService } from './core/services/translation.service';
import { SearchService } from './core/services/search.service';
import { CountryService } from './core/shared/components/intl-phone-number/intl-phone-number.service';
import { NotificationService } from './core/shared/components/notifcations/notification.service';
import { LockService } from './core/shared/components/lock/lock.service';
import { UserService } from './components/user/user.service';
import { ContentEditorService } from './components/content-editor/content-editor.service'
import { CustomerService } from './components/customer/customer.service';
import { CustomerDetailService } from './components/customer/customer-detail/customer-detail.service';
import { PromotionService } from './components/promotion/promotion.service';
import { ReviewService } from './components/review/review.service';
import { SmsService } from './components/sms/sms.service';
import { EmailCampaignService } from './components/email-campaign/email-campaign.service';
import { BillingService } from './components/billing/billing.service';
import { UserManagementService } from './components/bo-management/user-management.service';
import { ProductService } from './components/bo-management/product/product.service';
import { StatsService } from './components/stats/stats.service';
import { MobilePreviewService } from './components/mobile-preview/mobile-preview.service';
import { SponsorService } from './components/sponsor/sponsor.service';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PendingChangesGuard } from './guards/pending-changes.guard';

export const APP_PROVIDERS = [
    HttpService,
    AuthHttpService,
    LookupService,
    TranslationService,
    SearchService,
    UserService,
    CountryService,
    NotificationService,
    LockService,
    ContentEditorService,
    CustomerService,
    CustomerDetailService,
    PromotionService,
    ReviewService,
    SmsService,
    EmailCampaignService,
    BillingService,
    UserManagementService,
    ProductService,
    StatsService,
    MobilePreviewService,
    SponsorService,
    AuthGuard,
    PermissionGuard,
    PendingChangesGuard
];