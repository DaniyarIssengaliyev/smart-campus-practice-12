# Smart Campus Room Availability Checker

Software Engineering Practice 12 · Issengaliyev Daniyar · 24B031821 · Tuesday, 13:00

| Implementation | Live demo | Source |
|---|---|---|
| Code-based, Practice 12 | [GitHub Pages](https://daniyarissengaliyev.github.io/smart-campus-practice-12/) | [Browser interface](index.html), [validation](adapter.js), [booking rules](logic.ts) |
| Low-code, Practice 12 | [Appsmith](https://smart-campus-practice-15.appsmith.com/app/smart-campus-room-availability-checker/page1-6b05cedf177cd4bd6b01eea9) | [Published application export](Smart-Campus.json) |
| Practice 11 baseline | [Netlify](https://comfy-druid-4dd4ff.netlify.app/) | [Baseline screenshot](netlify-baseline.png) |

## Submission

[Report](Practice12_Report.docx) · [Shared requirements](requirements.md) · [Expected and observed results](acceptance-results.csv) · [Comparison, security review and reflection](Practice12_Report.docx)

Both published interfaces passed all eight cases. [Code observations](code-results.json) and [Appsmith observations](appsmith-results.json) include the schedule before and after the checks.

| Case | Code-based screenshot | Appsmith screenshot |
|---|---|---|
| T1 | [Code T1](code-T1.png) | [Appsmith T1](appsmith-T1.png) |
| T2 | [Code T2](code-T2.png) | [Appsmith T2](appsmith-T2.png) |
| T3 | [Code T3](code-T3.png) | [Appsmith T3](appsmith-T3.png) |
| T4 | [Code T4](code-T4.png) | [Appsmith T4](appsmith-T4.png) |
| T5 | [Code T5](code-T5.png) | [Appsmith T5](appsmith-T5.png) |
| T6 | [Code T6](code-T6.png) | [Appsmith T6](appsmith-T6.png) |
| T7 | [Code T7](code-T7.png) | [Appsmith T7](appsmith-T7.png) |
| T8 | [Before](code-baseline.png) / [after](code-T7.png) | [Before](appsmith-baseline.png) / [after](appsmith-T7.png) |

[Appsmith editor](appsmith-editor.png) · [Rule engine on GitHub](code-source.png)

## Reproduce

Open index.html and browser.js in the same directory, or use the live link. To rebuild after editing a JavaScript module, run `node build.cjs` from the repository root. Run `node acceptance.cjs` for the code-based engine checks. To restore the visual application, use **Create new → Import → Import from file** in Appsmith and select Smart-Campus.json. The demo requires no data connector.

The baseline uses start and end time and supports several rooms. Practice 12 exposes duration and room status for the same Room 101 in both interfaces.
