# Pole obszaru między y = x² a y = cos(x)

Projekt z metod numerycznych: wyznaczamy punkty przecięcia krzywych metodą bisekcji, a pole obszaru liczymy metodą trapezów i metodą Simpsona. Wynik jest przedstawiony na stronie internetowej (GitHub Pages) w pięciu modułach.

Strona: https://alexander-288.github.io/factorial2/

## Uruchomienie lokalne

Potrzebny jest Node.js (24) i Python.

```
npm ci
npm test
npm run build
npm run serve
```

Strona będzie pod `http://localhost:8000`. Build kopiuje `site/` do `dist/`, dokłada pliki zespołu i zamienia wzory `$...$` oraz `$$...$$` na gotowy HTML KaTeX.

## Animacja

Projekt Motion Canvas jest w folderze `animacja/`.

```
cd animacja
npm ci
npm start
```

Edytor działa pod `http://localhost:9000`. Nagranie MP4 renderuje się w edytorze (Video Settings, exporter Video (FFmpeg), Render), a gotowy plik trzeba skopiować do `site/media/animacja.mp4`. `npm run build` w tym folderze buduje wersję do osadzenia na stronie.

## Edycja treści (BluntCMS)

Strona działa z BluntCMS Thick. Folder `site/` to katalog strony, a `site/blunt/` nie jest w repozytorium.

1. Rozpakuj BluntCMS Thick do `site/blunt/`.
2. Uruchom `php -S localhost:8090 -t site`.
3. Otwórz `http://localhost:8090/blunt/setup.php`, ustaw hasło i plik tokenów `css/tokens.css`.
4. Edytuj strony, np. `http://localhost:8090/blunt/edit.php?page=index.html`.

Każdy tekst ma nazwę `data-blunt`. Wzory zapisuje się jako zwykły LaTeX między `$`. Po edycji uruchom `npm run build` i zrób commit.

## Moduły strony

1. Opracowanie matematyczne
2. Implementacja programistyczna (Python i C++)
3. Arkusz kalkulacyjny
4. Aplet GeoGebry
5. Animacja metod numerycznych

## Zespół

- **Aleksander Sprengel** - strona, opracowanie matematyczne, GeoGebra, animacja
- **Adam Kowalczyk** - program w Pythonie
- **Mikołaj Ankiewicz** - program w C++
- **Kordian Nastały** - arkusz kalkulacyjny

Zadania dla poszczególnych osób są opisane w pliku [ZADANIA.md](ZADANIA.md).

## Licencja

MIT, zobacz [LICENSE](LICENSE).
