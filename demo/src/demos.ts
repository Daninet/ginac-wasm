export const DEMOS = [
  {
    name: 'Estimate PI',
    text: `
digits = 10
degree = 22
pi_expansion = series_to_poly(series(atan(x), x, degree))
pi_approx = 16*subs(pi_expansion, x==(1/5)) - 4*subs(pi_expansion, x==(1/239))
evalf(pi_approx)`.trim(),
  },
  {
    name: 'Hermite polynomials',
    text: `
HKer = exp(-pow(x, 2))
n = 5
H_5 = normal(pow(-1, n) * diff(HKer, x, n) / HKer)`.trim(),
  },
  {
    name: 'Arbitrary precision',
    text: `
a=3^150
b=3^149
a/b
b/a

1/7
evalf(1/7)
digits = 150
evalf(1/7)

digits = 50
fsolve(cos(x)==x, x, 0, 2)
f=exp(sin(x))-x
X=fsolve(f,x,-10,10)
subs(f,x==X)`.trim(),
  },
  {
    name: 'Convert units',
    text: `
in=.0254*m
lb=.45359237*kg
200*lb/in^2`.trim(),
  },
  {
    name: 'Lists',
    text: `
{x, 2, y, x+y}
{1, 2} + {3, 4, 5}
sort({4, 3, 1, 2})
at({sin(x), cos(x), sin(x) + cos(x)}, 1)
at({1, 2, 3, 4}, -1)
unique({1, 1, 2, 3, 2, 2})
`.trim(),
  },
  {
    name: 'Numeric functions',
    text: `
inverse(3)
pow(2, 3)
abs(-3)
real(1+2I)
imag(1-2i)
csgn(-1)
step(1)
numer(2/3)
denom(2/3)
sqrt(2)
isqrt(2)
sin(Pi/3)
cos(Pi/3)
tan(Pi/3)
asin(1/2)
acos(1/2)
atan(1/2)
atan(1, 2)
sinh(Pi*i/6)
cosh(Pi*i/6)
tanh(Pi*i/6)
asinh(i/6)
acosh(i/6)
atanh(i/6)
exp(10)
log(10)
Li2(10)
zeta(3)
tgamma(3)
lgamma(3)
psi(3)
psi(3, 2)
factorial(5)
doublefactorial(5)
binomial(2, 3)
bernoulli(4)
fibonacci(4)
mod(5, 3)
smod(5, 3)
irem(7, 3)
iquo(7, 3)
gcd(25, 30)
lcm(6, 9)
`.trim(),
  },
].sort((a, b) => a.name.localeCompare(b.name));
