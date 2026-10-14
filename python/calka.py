"""Pole obszaru ograniczonego przez y = x^2 oraz y = cos(x).

Metody: bisekcja, zlozona metoda trapezow i zlozona metoda Simpsona.
Program korzysta wylacznie z biblioteki standardowej Pythona.
"""

import math


def funkcja(x):
    """Roznica funkcji: cos(x) - x^2 (dodatnia miedzy przecieciami)."""
    return math.cos(x) - x ** 2


def bisekcja(a, b, eps=1e-12):
    """Znajduje miejsce zerowe w [a, b] z dokladnoscia eps."""
    if eps <= 0:
        raise ValueError("Dokladnosc eps musi byc dodatnia.")
    fa = funkcja(a)
    fb = funkcja(b)
    if fa == 0:
        return a, 0
    if fb == 0:
        return b, 0
    if fa * fb > 0:
        raise ValueError("Funkcja musi miec rozne znaki na koncach przedzialu.")

    iteracje = 0
    while (b - a) / 2 >= eps:
        srodek = (a + b) / 2
        fs = funkcja(srodek)
        if fs == 0:
            return srodek, iteracje + 1
        if fa * fs < 0:
            b = srodek
        else:
            a = srodek
            fa = fs
        iteracje += 1
    return (a + b) / 2, iteracje


def trapezy(a, b, n):
    """Zlozona metoda trapezow dla calki z funkcja(x)."""
    if n <= 0:
        raise ValueError("Liczba przedzialow musi byc dodatnia.")
    h = (b - a) / n
    suma = (funkcja(a) + funkcja(b)) / 2
    for i in range(1, n):
        suma += funkcja(a + i * h)
    return h * suma


def simpson(a, b, n):
    """Zlozona metoda Simpsona; n musi byc dodatnie i parzyste."""
    if n <= 0 or n % 2 != 0:
        raise ValueError("W metodzie Simpsona n musi byc dodatnie i parzyste.")
    h = (b - a) / n
    suma = funkcja(a) + funkcja(b)
    for i in range(1, n):
        wspolczynnik = 4 if i % 2 else 2
        suma += wspolczynnik * funkcja(a + i * h)
    return h * suma / 3


def main():
    # Obie funkcje sa parzyste, wiec punkty przeciecia sa symetryczne.
    a, iteracje_a = bisekcja(-1, 0)
    b, iteracje_b = bisekcja(0, 1)

    # Wartosc referencyjna otrzymana z calki oznaczonej.
    # Calka z (cos(x) - x^2) dx = sin(x) - x^3/3.
    pole_dokladne = (math.sin(b) - b ** 3 / 3) - (math.sin(a) - a ** 3 / 3)

    print("POLE OBSZARU MIEDZY y = x^2 A y = cos(x)")
    print("=" * 58)
    print(f"Punkt przeciecia A: ({a:.6f}, {a*a:.6f})")
    print(f"Punkt przeciecia B: ({b:.6f}, {b*b:.6f})")
    print(f"Iteracje bisekcji: A = {iteracje_a}, B = {iteracje_b}")
    print(f"Pole referencyjne: {pole_dokladne:.6f}")
    print()
    print(f"{'n':>6} | {'Trapezy':>12} | {'Simpson':>12} | {'Blad trapezow':>14} | {'Blad Simpsona':>14}")
    print("-" * 73)
    for n in (4, 10, 100, 1000, 10000):
        t = trapezy(a, b, n)
        s = simpson(a, b, n)
        print(f"{n:>6} | {t:>12.6f} | {s:>12.6f} | {abs(t-pole_dokladne):>14.6f} | {abs(s-pole_dokladne):>14.6f}")


if __name__ == "__main__":
    main()
