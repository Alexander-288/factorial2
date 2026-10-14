# Zadania dla zespołu

## Problem (wspólny dla wszystkich)

Liczymy pole obszaru między krzywymi y = x² i y = cos(x).

- Funkcja pomocnicza: `f(x) = cos(x) - x^2`
- Punkty przecięcia to miejsca zerowe `f`. Funkcja jest parzysta, więc są dwa: `-r` i `+r`.
- Pole: całka z `f(x)` od `-r` do `r`.

### Bisekcja (ustalone parametry, żeby wyniki się zgadzały)

- Pierwiastek dodatni szukamy na przedziale `[0, 1]`, ujemny na `[-1, 0]`.
- Dokładność `eps = 1e-6`.
- Krok: `c = (a + b) / 2`. Jeśli `f(a) * f(c) < 0`, to `b = c`, w przeciwnym razie `a = c`.
- Stop, gdy `(b - a) / 2 < eps`. Wynik to `c = (a + b) / 2` z ostatniego przedziału.

### Całkowanie

- Granice: `a = -r`, `b = r` (z bisekcji), `h = (b - a) / n`, `x_i = a + i*h`.
- Trapezy: `h * (f(x_0)/2 + f(x_1) + ... + f(x_(n-1)) + f(x_n)/2)`
- Simpson (n musi być parzyste): `h/3 * (f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + ... + 4f(x_(n-1)) + f(x_n))`

### Wyniki kontrolne (Twój program/arkusz powinien je dać)

| Wielkość | Wartość |
|---|---|
| r (pierwiastek dodatni) | 0.824132 |
| liczba iteracji bisekcji | 19 |
| trapezy, n = 4 | 1.027278 |
| trapezy, n = 10 | 1.083966 |
| trapezy, n = 100 | 1.094646 |
| Simpson, n = 4 | 1.094994 |
| Simpson, n = 10 | 1.094760 |
| Simpson, n = 100 | 1.094754 |
| pole dokładne (2 sin r - 2r³/3) | 1.094754 |

Jeśli coś się nie zgadza na 6. miejscu po przecinku, sprawdź warunek stopu bisekcji.

## Jak oddać pracę

1. Przyjmij zaproszenie do repozytorium (mail z GitHuba).
2. Sklonuj repo i zrób własną gałąź:
   ```
   git clone https://github.com/Alexander-288/factorial2.git
   cd factorial2
   git checkout -b twoje-imie
   ```
3. Wrzuć pliki do swojego folderu (niżej), potem:
   ```
   git add .
   git commit -m "Dodaj program w Pythonie"
   git push -u origin twoje-imie
   ```
4. Na GitHubie otwórz Pull Request do `main`.

Kod pokażemy na stronie dokładnie tak, jak go napiszesz, więc zadbaj o czytelność i komentarze po polsku.

## Adam Kowalczyk - program w Pythonie

Folder: `python/`

- `python/calka.py` - program, który:
  - wypisuje `eps` i `n`,
  - szuka bisekcją pierwiastka dodatniego i ujemnego (z liczbą iteracji),
  - liczy pole metodą trapezów i metodą Simpsona dla `n = 4, 10, 100`,
  - wypisuje pole dokładne do porównania.
- Tylko biblioteka standardowa (`math`), bez numpy.
- Czytelne komentarze po polsku.
- `python/zrzut.png` - zrzut ekranu z uruchomienia w terminalu lub IDE. Muszą być widoczne `eps`, `n` i wynik pola.

## Mikołaj Ankiewicz - program w C++

Folder: `cpp/`

- `cpp/calka.cpp` - to samo co program w Pythonie (bisekcja obu pierwiastków, trapezy i Simpson dla `n = 4, 10, 100`, pole dokładne).
- Tylko biblioteka standardowa (`<cmath>`, `<iostream>`, `<iomanip>`). Wyniki wypisuj z 6 miejscami po przecinku (`std::setprecision`).
- Czytelne komentarze po polsku.
- `cpp/zrzut.png` - zrzut ekranu z kompilacji i uruchomienia. Muszą być widoczne `eps`, `n` i wynik pola.

## Kordian Nastały - arkusz kalkulacyjny

Folder: `arkusz/`

- `arkusz/obszar.xlsx` z trzema arkuszami. Wszystko liczone **formułami**, nie wpisanymi wartościami.
  (W polskim Excelu: `JEŻELI` zamiast `IF`, przecinek dziesiętny. `COS` i `SIN` bez zmian.)

**Arkusz „Bisekcja”**
- Kolumny: `k`, `a`, `b`, `c`, `f(a)`, `f(b)`, `f(c)`, `(b-a)/2`.
- Pierwszy wiersz: `a = 0`, `b = 1`. Kolejne wiersze wg reguły z sekcji „Bisekcja”.
- 19 iteracji, ostatnie `c` ≈ 0.824132.

**Arkusz „Całkowanie”**
- Na górze parametry: `a = -r`, `b = r` (odwołanie do wyniku z arkusza „Bisekcja”), `n = 10`, `h = (b-a)/n`.
- Kolumny: `i`, `x_i`, `f(x_i)`, `waga trapezy` (1/2 na końcach, 1 w środku), `waga Simpson` (1, 4, 2, 4, ..., 4, 1).
- Pod tabelą: wynik trapezów (≈ 1.083966), wynik Simpsona (≈ 1.094760) i pole dokładne (≈ 1.094754).

**Arkusz „Wykres”**
- Tabela pomocnicza `x` od -1.5 do 1.5 co 0.05 z kolumnami `x^2` i `cos(x)`.
- Wykres punktowy z liniami: obie krzywe, zaznaczone punkty przecięcia.
- Mile widziane: zacieniowany obszar między krzywymi.

- `arkusz/zrzut.png` - zrzut ekranu arkusza z wykresem.
