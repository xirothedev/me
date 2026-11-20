# Load memory budget

We measure first-load memory as **peak renderer process RSS** on a cold load of a production build. We set the initial budget at **<120 MB peak renderer RSS** and **<25 MB used JS heap** per Page. Lighthouse is not a memory metric: it scored 100 on `/` while the renderer peaked at ~171 MB.

## Considered options

- **Used JS heap** (`performance.memory`): easy to read, but it excludes decoded images, SVG filter buffers and compositor layers. On `/` it reported 19.8 MB while renderer RSS peaked at ~171 MB. Rejected as the budget metric.
- **`performance.measureUserAgentSpecificMemory()`**: gives a full tab breakdown, but needs cross-origin isolation. The site is not cross-origin isolated. Rejected.
- **Lighthouse performance score**: already 100 on `/`. It does not measure resident memory. Rejected.
- **Peak renderer RSS**: read from the OS process table on an isolated, cold load. Captures decoded images, filter buffers and layers. Accepted.

## Consequences

The baseline was measured on production at `https://xirothedev.resonance.io.vn/` on 2026-11-20. Home peaked at ~171 MB renderer RSS and settled at ~104 MB. A reported 550 MB figure could not be reproduced; it most likely measured the whole browser process tree. Re-measure after any change to the Hero, Figures or client boundaries before accepting a regression.

After baking the three motion planes into WebP assets and removing the client biography island, a cold local reload still peaked at ~198 MB renderer RSS. The 120 MB target is not met. Further reduction needs a lower Hero resolution or fewer motion layers, both of which change the design.
