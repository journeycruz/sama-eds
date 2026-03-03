# Resource Listing Block Table Examples

Use the following two-column key-value table format to author the `resource-listing` block.

## Default card view

| resource-listing | |
| --- | --- |
| Name | San Antonio Food Bank |
| Description | Regional food distribution and partner pantry network serving Bexar County families. |
| Address | 5200 Historic Old Hwy 90, San Antonio, TX 78227 |
| Phone | 2103373663 |
| Tags | pantry, groceries, family |
| Last Verified | 2026-02-28 |
| Name | Haven for Hope Courtyard Meals |
| Description | Hot meal service and supportive intake for adults experiencing homelessness. |
| Address | 1 Haven for Hope Way, San Antonio, TX 78207 |
| Phone | 2102202100 |
| Tags | meals, emergency |
| Last Verified | 2026-02-20 |
| Name | WIC Enrollment Center - West Commerce |
| Description | WIC application help, nutrition counseling, and infant feeding support. |
| Address | 2910 W Commerce St, San Antonio, TX 78207 |
| Phone | 2102074650 |
| Tags | wic, enrollment, family |
| Last Verified | 2026-02-18 |

## Compact list view variant

| resource-listing (compact) | |
| --- | --- |
| Name | Family Violence Prevention Services Hotline |
| Description | 24/7 domestic violence crisis hotline with shelter and safety planning referrals. |
| Address | 7911 Broadway, San Antonio, TX 78209 |
| Phone | 2107338810 |
| Tags | hotline, domestic-violence, shelter |
| Last Verified | 2026-02-27 |
| Name | San Antonio Mobile Crisis Outreach Team |
| Description | Mental health crisis response and de-escalation for urgent behavioral health concerns. |
| Address | 601 N Frio St, San Antonio, TX 78207 |
| Phone | 2102237233 |
| Tags | mental-health, hotline, emergency |
| Last Verified | 2026-02-26 |

## Field reference

| Field | Required | Notes |
| --- | --- | --- |
| Name | Yes | Resource name shown as the card/list title. |
| Description | Yes | Short summary visible in the listing. |
| Address | No | Used for display and `Get Directions` Google Maps link. |
| Phone | No | Rendered as clickable `tel:` link and formatted for display. |
| Tags | No | Comma-separated values used to build filter buttons. |
| Last Verified | No | Rendered as a badge when present. |
