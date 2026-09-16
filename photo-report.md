# Task C: Hainan Scenic Photo Collection

Collected and visually inspected on 2026-09-16 for the attributed private family roadbook.

Seven place-specific photographs are supplied in `photos/`, using the requested filenames. All are published real-world photographs from hotel/scenic operators, scenic-operator contributions to the Hainan Tourism Association, or credited Hainan news photography. No AI-generated image, illustration, render, generic stock replacement, watermark removal, retouching, or upscaling was used. Final JPEGs retain the downloaded source bytes.

## Delivered Files

| ID / file | Native dimensions | Verified subject | Attribution |
| --- | --- | --- | --- |
| `photos/mulan.jpg` | 900 x 502 | White Mulantou lighthouse on its rocky headland; beach coastline and distant wind turbines at upper left | Fu Weili / Hinews, New Hainan |
| `photos/tonggu.jpg` | 900 x 600 | Moon Bay's curving white shore viewed from Tongguling | Yuan Chen / Hainan Daily |
| `photos/dongjiao.jpg` | 900 x 600 | Dongjiao coconut grove, beach and sea at right | Xuezhen / Hinews photography column |
| `photos/fenjie.jpg` | 1920 x 1080 | Fenjiezhou Island coastal aerial, hillside bungalows and clear reef water | Official Fenjiezhou Island website |
| `photos/hyatt.jpg` | 2560 x 1440 | Correct Hyatt Regency Hainan Ocean Paradise exterior, illuminated facade and property sign | Official Hyatt property website |
| `photos/oceanpark.jpg` | 1095 x 500 | Hainan Ocean Paradise's blue Nanhai Eye Ferris wheel beside its lagoon | Official Hainan Ocean Paradise website |
| `photos/monkey.jpg` | 1280 x 721 | Nanwan Monkey Island cableway over Xincun harbour's floating fishing rafts | Scenic operator, via Hainan Tourism Association |

Four images meet the preferred width of at least 1000 pixels. Mulan, Tonggu and Dongjiao are authentic native 900px images. Source certainty, the requested viewpoint and readable scenery were prioritized over artificial enlargement.

## Important Visual Qualification

**Mulan's exact requested orange-red top could not be verified.** The [supplied January 2026 local-media article](https://news.hainan.net/zixun/2026/01/07/4800907.shtml) describes an orange-red lantern room, but its own 1080 x 608 photo shows a gray/white lantern top. The selected [Fu Weili photograph](https://m.hinews.cn/page?m=1&n=2729452&s=1044) and other inspected news photos agree on the real tower's appearance. The selected file includes the white tower and distant wind-farm coast, but **does not visually satisfy the orange-red-top detail**. It has not been recolored or replaced with a different lighthouse. Use a neutral caption such as "Mulantou Lighthouse and the wind-farm coast".

## Sources and Inspection

1. **Mulan:** [Hinews: Haikou-Puqian day trip](https://m.hinews.cn/page?m=1&n=2729452&s=1044). The caption names the lighthouse and credits Fu Weili. The New Hainan watermark remains at bottom right. Both rocky beaches and a distant row of coastal turbines are visible.
2. **Tonggu:** [Hinews: Hainan tourism routes](https://m.hinews.cn/page?m=1&n=2728350&s=1044). The photograph's caption explicitly says it is a view of Moon Bay from Tongguling and credits Hainan Daily photographer Yuan Chen. The Hainan Daily watermark remains intact. Larger official scenic alternatives were inspected, but showed the platform/cape rather than the requested bay view.
3. **Dongjiao:** [Hinews photography feature](https://m.hinews.cn/page?m=1&n=2688870&s=1044). The image is explicitly captioned Dongjiao Coconut Grove and credited to photographer Xuezhen. Palms, beach and water are visible; the Hinews photography-column watermark remains at bottom right.
4. **Fenjie:** [Official island website](https://www.hnfjz.com/). Its public homepage Body.js references the selected 1920px asset. The inspected frame is a genuine aerial coastal detail with reef water and hillside cottages, not a whole-island panorama.
5. **Hyatt:** [Official HAKRH property page](https://www.hyatt.com/hyatt-regency/zh-CN/hakrh-hyatt-regency-hainan-ocean-paradise-resort). The downloaded asset is labeled `HAKRH-P0010-Exterior-Night-View`. The hotel sign, shell-like facade and neighboring theme park are clearly visible. Node fetch retrieved the public image even though the web reader received an asset error.
6. **Oceanpark:** [Official Nanhai Eye attraction page](https://www.opresort.cn/web/flhy/rmtj/mtl.html). The source image shows the blue/yellow Ferris wheel and lagoon. Its structure agrees with the wheel in Hyatt's independently sourced photograph. The site's legacy local folder name contains `cdn.chimelong.com`; the actual image host is `www.opresort.cn`. The original framing clips the top of the wheel.
7. **Monkey:** [Hainan Tourism Association member feature](https://www.hainanta.org.cn/html/948/2024-10-18/content-1478.html). The page states the scenic operator provided its text and photos. The chosen photo visibly includes the yellow gondola, cables, new-village harbour and floating fishing rafts. It replaces the 610px alternative on the scenic operator's own overview page.

## Integration Notes

- `photo-sources.json` is the requested JSON array with exactly `id`, `file`, `sourceUrl`, `imageUrl`, `credit`, `width`, `height`, and `notes` for each image. Paths are relative to this roadbook root.
- Retain the Chinese `credit` strings in the roadbook's attribution area. This collection records provenance for the requested private family use; no open-license status is asserted.
- Mulan, Tonggu and Dongjiao have bottom-right watermarks. Display their complete frames where possible, and do not crop or cover those marks with card labels. The delivered files preserve them.
- All seven final images were opened and inspected individually. Dimensions were measured from image bytes, not webpage display sizes. The files are actual decodable JPEGs.
- The existing parent `photos/` directory was inspected before collection. It contains other destinations, so those assets were not downloaded again.
- Scope: only this root's `photos/`, `photo-sources.json`, and `photo-report.md` were written. Build, data, gallery, maps and scene assets were not edited.
- Research scripts and rejected candidates were removed after verification; `photos/` contains only the seven requested deliverable JPEGs.
