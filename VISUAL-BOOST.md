# Visual detail boost

This pass increases selected detail counts by 50%, rather than treating perceived graphics quality as a measurable percentage:

| Detail | Previous | Updated |
| --- | ---: | ---: |
| Fine pavement texture samples | 1100 | 1650 |
| Pavement highlight samples | 56 | 84 |
| Wall texture samples | 800 | 1200 |
| Cleveland water highlights | 100 | 150 |
| Full-effects impact rays | 10 | 15 |
| Full-effects special-burst rays | 12 | 18 |
| Full-effects projectile trail layers | 4 | 6 |

All ten stages also gain cached material highlights: storefront glass, washer dial details, metal edge glints, bridge fasteners, window reflections and pavement seams. Fighter rim lighting and local contrast receive a modest boost while preserving source artwork and outfits.

`visual-boost.js` retains at most one stage overlay on coarse-pointer devices and two elsewhere. Performance resolution bypasses the extra overlay; Low effects retains the previous low-cost ray/trail counts. Existing Auto resolution caps and adaptive effects remain active. The upgrade does not increase fighter size, change simulation, or force 4K on Android.

Validation: `node visual-boost.test.cjs`, special animation/grounding/smooth-movement regression checks, offline checks, real browser canvas validation and nine automatically rotating CPU showcase bouts. Physical-device frame-rate measurements remain outstanding.
