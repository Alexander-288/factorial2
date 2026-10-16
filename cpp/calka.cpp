// Pole obszaru między y = x^2 a y = cos(x)
// Bisekcja wyznacza punkty przecięcia, a pole liczymy metodą trapezów i Simpsona.
// Kompilacja: g++ -std=c++20 -O2 -o calka calka.cpp

#include <format>
#include <iostream>
#include <cstdint>
#include <exception>
#include <cmath>
#include <iomanip>

static constexpr double epsilon = 1e-6;

// Funkcja f(x) = cos(x) - x^2; jej miejsca zerowe to punkty przecięcia krzywych
inline double f(double x) 
{
    return std::cos(x) - x * x;
}

// Wynik bisekcji: przybliżony pierwiastek i liczba wykonanych kroków
struct BisectionResult 
{
    double root;
    size_t iterations;
};

// Bisekcja na [a, b]; kończy, gdy połowa długości przedziału spadnie poniżej eps
BisectionResult bisect(double a, double b) 
{
    if (f(a) * f(b) > 0) throw std::invalid_argument("Brak zmiany znaku na koncach przedzialu");

    size_t k = 0;
    while ((b - a) / 2 >= epsilon) 
    {
        double c = (a + b) / 2;

        // Zostawiamy połowę, na której funkcja zmienia znak (twierdzenie Darboux)
        if (f(a) * f(c) < 0) b = c;
        else a = c;

        k++;
    }

    return BisectionResult{(a + b) / 2, k};
}

// Złożona metoda trapezów: h * (f0/2 + f1 + ... + f(n-1) + fn/2)
double trapezy(double a, double b, size_t n) 
{
    double h = (b - a) / n;
    double suma = (f(a) + f(b)) / 2;

    for (size_t i = 1; i < n; i++) 
    {
        suma += f(a + i * h);
    }

    return h * suma;
}

// Złożona metoda Simpsona (n parzyste): h/3 * (f0 + 4f1 + 2f2 + ... + 4f(n-1) + fn)
double simpson(double a, double b, size_t n) 
{
    if (n % 2 != 0) throw std::invalid_argument("W metodzie Simpsona n musi byc parzyste");

    double h = (b - a) / n;
    double suma = f(a) + f(b);

    for (size_t i = 1; i < n; i++) 
    {
        suma += (i % 2 == 1 ? 4 : 2) * f(a + i * h);
    }

    return h / 3 * suma;
}

int main()
{
    // Pierwiastek ujemny na [-1, 0] i dodatni na [0, 1]
    BisectionResult left = bisect(-1.0, 0.0);
    BisectionResult right = bisect(0.0, 1.0);
    double a = left.root;
    double b = right.root;

    // Wartość dokładna do porównania: całka z cos(x) - x^2 to sin(x) - x^3/3
    double exact = (std::sin(b) - b * b * b / 3) - (std::sin(a) - a * a * a / 3);

    std::cout<<"Pole obszaru miedzy y = x^2 a y = cos(x)\n\n";
    std::cout<<std::format("Dokladnosc bisekcji eps = {:.0e}\n", epsilon);
    std::cout<<std::format("Punkt przeciecia a = {:.6f} ({} iteracji)\n", a, left.iterations);
    std::cout<<std::format("Punkt przeciecia b = {:.6f} ({} iteracji)\n\n", b, right.iterations);
    std::cout<<std::setw(6)<<"n"<<std::setw(14)<<"trapezy"<<std::setw(14)<<"Simpson"
        <<std::setw(14)<<"blad trap."<<std::setw(14)<<"blad simps."<<'\n';
    for(size_t n : {4, 10, 100})
    {
        double t = trapezy(a, b, n);
        double s = simpson(a, b, n);
        std::cout << std::fixed << std::setprecision(6) << std::setw(6) << n << std::setw(14) << t << std::setw(14) << s
            << std::setw(14) << std::fabs(t - exact) << std::setw(14) << std::fabs(s - exact) << "\n";
    }
    std::cout<<'\n';

    std::cout<<std::format("Pole dokładne P = {:.6f}\n", exact);
    std::cout<<std::format("Wynik (Simpson, n = 100): P = {:.6f}\n", simpson(a, b, 100));
}