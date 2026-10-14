// Pole obszaru między y = x^2 a y = cos(x)
// Bisekcja wyznacza punkty przecięcia, a pole liczymy metodą trapezów i Simpsona.
// Kompilacja: g++ -O2 -o calka calka.cpp

#include <cmath>
#include <iomanip>
#include <iostream>
#include <stdexcept>

// Funkcja f(x) = cos(x) - x^2; jej miejsca zerowe to punkty przecięcia krzywych
double f(double x) {
    return std::cos(x) - x * x;
}

// Wynik bisekcji: przybliżony pierwiastek i liczba wykonanych kroków
struct WynikBisekcji {
    double pierwiastek;
    int iteracje;
};

// Bisekcja na [a, b]; kończy, gdy połowa długości przedziału spadnie poniżej eps
WynikBisekcji bisekcja(double a, double b, double eps) {
    if (f(a) * f(b) > 0) {
        throw std::invalid_argument("Brak zmiany znaku na koncach przedzialu");
    }
    int k = 0;
    while ((b - a) / 2 >= eps) {
        double c = (a + b) / 2;
        // Zostawiamy połowę, na której funkcja zmienia znak (twierdzenie Darboux)
        if (f(a) * f(c) < 0) {
            b = c;
        } else {
            a = c;
        }
        k++;
    }
    return {(a + b) / 2, k};
}

// Złożona metoda trapezów: h * (f0/2 + f1 + ... + f(n-1) + fn/2)
double trapezy(double a, double b, int n) {
    double h = (b - a) / n;
    double suma = (f(a) + f(b)) / 2;
    for (int i = 1; i < n; i++) {
        suma += f(a + i * h);
    }
    return h * suma;
}

// Złożona metoda Simpsona (n parzyste): h/3 * (f0 + 4f1 + 2f2 + ... + 4f(n-1) + fn)
double simpson(double a, double b, int n) {
    if (n % 2 != 0) {
        throw std::invalid_argument("W metodzie Simpsona n musi byc parzyste");
    }
    double h = (b - a) / n;
    double suma = f(a) + f(b);
    for (int i = 1; i < n; i++) {
        suma += (i % 2 == 1 ? 4 : 2) * f(a + i * h);
    }
    return h / 3 * suma;
}

int main() {
    const double eps = 1e-6;

    // Pierwiastek ujemny na [-1, 0] i dodatni na [0, 1]
    WynikBisekcji lewy = bisekcja(-1.0, 0.0, eps);
    WynikBisekcji prawy = bisekcja(0.0, 1.0, eps);
    double a = lewy.pierwiastek;
    double b = prawy.pierwiastek;

    // Wartość dokładna do porównania: całka z cos(x) - x^2 to sin(x) - x^3/3
    double dokladne = (std::sin(b) - b * b * b / 3) - (std::sin(a) - a * a * a / 3);

    std::cout << std::fixed << std::setprecision(6);
    std::cout << "Pole obszaru miedzy y = x^2 a y = cos(x)\n\n";
    std::cout << "Dokladnosc bisekcji eps = " << std::scientific << std::setprecision(0) << eps
              << std::fixed << std::setprecision(6) << "\n";
    std::cout << "Punkt przeciecia a = " << a << "  (" << lewy.iteracje << " iteracji)\n";
    std::cout << "Punkt przeciecia b = " << b << "  (" << prawy.iteracje << " iteracji)\n\n";

    std::cout << std::setw(6) << "n" << std::setw(14) << "trapezy" << std::setw(14) << "Simpson"
              << std::setw(14) << "blad trap." << std::setw(14) << "blad Simps." << "\n";
    for (int n : {4, 10, 100}) {
        double t = trapezy(a, b, n);
        double s = simpson(a, b, n);
        std::cout << std::setw(6) << n << std::setw(14) << t << std::setw(14) << s
                  << std::setw(14) << std::fabs(t - dokladne) << std::setw(14) << std::fabs(s - dokladne) << "\n";
    }

    std::cout << "\nPole dokladne P = " << dokladne << "\n";
    std::cout << "Wynik (Simpson, n = 100): P = " << simpson(a, b, 100) << "\n";
    return 0;
}
