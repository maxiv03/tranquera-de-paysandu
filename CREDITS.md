# Credits

Third-party media used in this demo. Everything else (brand, logo, texts, people, lots and the
generated placeholder illustrations) is original and fictional.

## Videos

All videos come from [Pexels](https://www.pexels.com) under the
[Pexels License](https://www.pexels.com/license/): free for commercial and non-commercial use,
attribution not required, modification allowed. Attribution is given here anyway.

They were trimmed, muted, scaled to 960 px wide and re-encoded with
`scripts/optimize-video.mjs` (arguments in the table). Posters are their first frame.

| File (`public/videos/`)                        | Original                                                                                                                             | Author                                                                    | Used in                       | Script arguments       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------- | ---------------------- |
| `herd-aerial.mp4`, `herd-aerial-poster.webp`   | [A Herd Of Cattle Feeding On The Pasture Grass](https://www.pexels.com/video/a-herd-of-cattle-feeding-on-the-pasture-grass-2766950/) | [Tom Fisk](https://www.pexels.com/@tomfisk/)                              | Live page; auction 121, lot 1 | `herd-aerial 2 16 33`  |
| `red-cattle.mp4`, `red-cattle-poster.webp`     | [Cows](https://www.pexels.com/video/cows-17274683/)                                                                                  | [Benjamin Hastings](https://www.pexels.com/@benjamin-hastings-593102908/) | Auction 120, lot 3            | `red-cattle 0 14 30`   |
| `hereford-cow.mp4`, `hereford-cow-poster.webp` | [A Cattle Feeding On Pasture Grass](https://www.pexels.com/video/a-cattle-feeding-on-pasture-grass-3407619/)                         | [ricardo kosloff](https://www.pexels.com/@ricardo-kosloff-1828910/)       | Auction 121, lot 7            | `hereford-cow 0 13 28` |

Source files: the 1280×720 renditions from Pexels, downloaded on 2026-10-06.

## Photos

All photos come from [Pexels](https://www.pexels.com) under the
[Pexels License](https://www.pexels.com/license/) (commercial use allowed, attribution optional).
They are listed in `scripts/photos.json` and processed by `scripts/import-photos.mjs`: smart
crop (lots 1200×900, covers 1600×900) and WebP at quality 70. The seed assigns lot photos from
per-category pools so no photo repeats within an auction.

| File (`public/images/`) | Original                                                 | Author              | Used for      |
| ----------------------- | -------------------------------------------------------- | ------------------- | ------------- |
| `auctions/cover-1.webp` | [Photo 30606205](https://www.pexels.com/photo/30606205/) | Michelle Chadwick   | Auction cover |
| `auctions/cover-2.webp` | [Photo 13542232](https://www.pexels.com/photo/13542232/) | Maria Teresa Ghezzi | Auction cover |
| `auctions/cover-3.webp` | [Photo 32306170](https://www.pexels.com/photo/32306170/) | Tomas Asurmendi     | Auction cover |
| `auctions/cover-4.webp` | [Photo 34258740](https://www.pexels.com/photo/34258740/) | Tomas Asurmendi     | Auction cover |
| `auctions/cover-5.webp` | [Photo 34258744](https://www.pexels.com/photo/34258744/) | Tomas Asurmendi     | Auction cover |
| `auctions/cover-6.webp` | [Photo 32255198](https://www.pexels.com/photo/32255198/) | Tomas Asurmendi     | Auction cover |
| `auctions/cover-7.webp` | [Photo 13424110](https://www.pexels.com/photo/13424110/) | Imperioame          | Auction cover |
| `lots/calves-01.webp`   | [Photo 19203538](https://www.pexels.com/photo/19203538/) | Joseba Garcia Moya  | Lots: calves  |
| `lots/calves-02.webp`   | [Photo 29057172](https://www.pexels.com/photo/29057172/) | Fox70               | Lots: calves  |
| `lots/calves-03.webp`   | [Photo 31669670](https://www.pexels.com/photo/31669670/) | Nikola Tomasic      | Lots: calves  |
| `lots/calves-04.webp`   | [Photo 35259958](https://www.pexels.com/photo/35259958/) | Joost Vanos         | Lots: calves  |
| `lots/calves-05.webp`   | [Photo 5092864](https://www.pexels.com/photo/5092864/)   | Malcolm Garret      | Lots: calves  |
| `lots/calves-06.webp`   | [Photo 6422352](https://www.pexels.com/photo/6422352/)   | DeAnn DaSilva       | Lots: calves  |
| `lots/calves-07.webp`   | [Photo 8707822](https://www.pexels.com/photo/8707822/)   | Chris Black         | Lots: calves  |
| `lots/calves-08.webp`   | [Photo 4488403](https://www.pexels.com/photo/4488403/)   | Will Kirk           | Lots: calves  |
| `lots/calves-09.webp`   | [Photo 27207625](https://www.pexels.com/photo/27207625/) | NC Farm Bureau Mark | Lots: calves  |
| `lots/calves-10.webp`   | [Photo 27207618](https://www.pexels.com/photo/27207618/) | NC Farm Bureau Mark | Lots: calves  |
| `lots/calves-11.webp`   | [Photo 39420139](https://www.pexels.com/photo/39420139/) | Jonathan Gobarden   | Lots: calves  |
| `lots/calves-12.webp`   | [Photo 30028254](https://www.pexels.com/photo/30028254/) | Maria Putinica      | Lots: calves  |
| `lots/steers-01.webp`   | [Photo 11629419](https://www.pexels.com/photo/11629419/) | Eric Garcia         | Lots: steers  |
| `lots/steers-02.webp`   | [Photo 18518279](https://www.pexels.com/photo/18518279/) | Elisa Giaccaglia    | Lots: steers  |
| `lots/steers-03.webp`   | [Photo 31111065](https://www.pexels.com/photo/31111065/) | NC Farm Bureau Mark | Lots: steers  |
| `lots/steers-04.webp`   | [Photo 14514729](https://www.pexels.com/photo/14514729/) | Ravish M            | Lots: steers  |
| `lots/steers-05.webp`   | [Photo 27207632](https://www.pexels.com/photo/27207632/) | NC Farm Bureau Mark | Lots: steers  |
| `lots/steers-06.webp`   | [Photo 27207617](https://www.pexels.com/photo/27207617/) | NC Farm Bureau Mark | Lots: steers  |
| `lots/steers-07.webp`   | [Photo 7573234](https://www.pexels.com/photo/7573234/)   | Larsoeya            | Lots: steers  |
| `lots/steers-08.webp`   | [Photo 26765048](https://www.pexels.com/photo/26765048/) | Dario Rawert        | Lots: steers  |
| `lots/steers-09.webp`   | [Photo 33963060](https://www.pexels.com/photo/33963060/) | Christina99999      | Lots: steers  |
| `lots/steers-10.webp`   | [Photo 7164014](https://www.pexels.com/photo/7164014/)   | NC Farm Bureau Mark | Lots: steers  |
| `lots/steers-11.webp`   | [Photo 7512355](https://www.pexels.com/photo/7512355/)   | NC Farm Bureau Mark | Lots: steers  |
| `lots/heifers-01.webp`  | [Photo 27207619](https://www.pexels.com/photo/27207619/) | NC Farm Bureau Mark | Lots: heifers |
| `lots/heifers-02.webp`  | [Photo 13064130](https://www.pexels.com/photo/13064130/) | Olavi Anttila       | Lots: heifers |
| `lots/heifers-03.webp`  | [Photo 25947852](https://www.pexels.com/photo/25947852/) | Christina99999      | Lots: heifers |
| `lots/heifers-04.webp`  | [Photo 27568762](https://www.pexels.com/photo/27568762/) | Maria Ines          | Lots: heifers |
| `lots/heifers-05.webp`  | [Photo 33949992](https://www.pexels.com/photo/33949992/) | Christina99999      | Lots: heifers |
| `lots/heifers-06.webp`  | [Photo 34676155](https://www.pexels.com/photo/34676155/) | User 2156436039     | Lots: heifers |
| `lots/heifers-07.webp`  | [Photo 15418103](https://www.pexels.com/photo/15418103/) | Jan Zakelj          | Lots: heifers |
| `lots/heifers-08.webp`  | [Photo 21371875](https://www.pexels.com/photo/21371875/) | Megan Durkin        | Lots: heifers |
| `lots/heifers-09.webp`  | [Photo 11629414](https://www.pexels.com/photo/11629414/) | Eric Garcia         | Lots: heifers |
| `lots/heifers-10.webp`  | [Photo 38439586](https://www.pexels.com/photo/38439586/) | Jiri Dockal         | Lots: heifers |
| `lots/cows-01.webp`     | [Photo 10357322](https://www.pexels.com/photo/10357322/) | Tom Fisk            | Lots: cows    |
| `lots/cows-02.webp`     | [Photo 27139037](https://www.pexels.com/photo/27139037/) | Rob Munro           | Lots: cows    |
| `lots/cows-03.webp`     | [Photo 27207621](https://www.pexels.com/photo/27207621/) | NC Farm Bureau Mark | Lots: cows    |
| `lots/cows-04.webp`     | [Photo 27207635](https://www.pexels.com/photo/27207635/) | NC Farm Bureau Mark | Lots: cows    |
| `lots/cows-05.webp`     | [Photo 28424334](https://www.pexels.com/photo/28424334/) | Julito Elizalde     | Lots: cows    |
| `lots/cows-06.webp`     | [Photo 28424335](https://www.pexels.com/photo/28424335/) | Julito Elizalde     | Lots: cows    |
| `lots/cows-07.webp`     | [Photo 39547551](https://www.pexels.com/photo/39547551/) | Azvern              | Lots: cows    |
| `lots/cows-08.webp`     | [Photo 5770400](https://www.pexels.com/photo/5770400/)   | Carsten Kohler      | Lots: cows    |
| `lots/cows-09.webp`     | [Photo 7164011](https://www.pexels.com/photo/7164011/)   | NC Farm Bureau Mark | Lots: cows    |
| `lots/cows-10.webp`     | [Photo 7164013](https://www.pexels.com/photo/7164013/)   | NC Farm Bureau Mark | Lots: cows    |
| `lots/cows-11.webp`     | [Photo 14479218](https://www.pexels.com/photo/14479218/) | Denitsa Kireva      | Lots: cows    |
| `lots/cows-12.webp`     | [Photo 27207626](https://www.pexels.com/photo/27207626/) | NC Farm Bureau Mark | Lots: cows    |

Agent portraits are generated initials (`scripts/generate-avatars.mjs`): the agents are
fictional, so they do not use photos of real people.
