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
    name: 'Matching expressions',
    text: `
match((x+y)^a,(x+y)^a)
match((x+y)^a,(x+y)^b)
match((x+y)^a,$1^$2)
match((x+y)^a,$1^$1)
match((x+y)^(x+y),$1^$1)
match((x+y)^(x+y),$1^$2)
match((a+b)*(a+c),($1+b)*($1+c))
match((a+b)*(a+c),(a+$1)*(a+$2))
match((a+b)*(a+c),($1+$2)*($1+$3))
match(a*(x+y)+a*z+b,a*$1+$2)
match(a+b+c+d+e+f,c)
match(a+b+c+d+e+f,c+$0)
match(a+b+c+d+e+f,c+e+$0)
match(a+b,a+b+$0)
match(a*b^2,a^$1*b^$2)
match(x*atan2(x,x^2),$0*atan2($0,$0^2))
match(atan2(y,x^2),atan2(y,$0))
`.trim(),
  },
  {
    name: 'Substituting expressions',
    text: `
subs(a^2+b^2+(x+y)^2,$1^2==$1^3)
subs(a^4+b^4+(x+y)^4,$1^2==$1^3)
subs((a+b+c)^2,a+b==x)
subs((a+b+c)^2,a+b+$1==x+$1)
subs(a+2*b,a+b==x)
subs(4*x^3-2*x^2+5*x-1,x==a)
subs(4*x^3-2*x^2+5*x-1,x^$0==a^$0)
subs(sin(1+sin(x)),sin($1)==cos($1))
expand(subs(a*sin(x+y)^2+a*cos(x+y)^2+b,cos($1)^2==1-sin($1)^2))
`.trim(),
  },
  {
    name: 'Expanding and collecting',
    text: `
a=expand((sin(x)+sin(y))*(1+p+q)*(1+d))
collect(a,{p,q})
collect(a,find(a,sin($1)))
collect(a,{find(a,sin($1)),p,q})
collect(a,{find(a,sin($1)),d})
collect_common_factors(q*x+q*y)
collect_common_factors(q*x^2+2*q*x*y+q*y^2)
collect_common_factors(q*(b*(q+c)*x+b*((q+c)*x+(q+c)*y)*y))
`.trim(),
  },
  {
    name: 'Linear equations',
    text: `
lsolve({a*x+b*y==3, x-y==b}, {x, y})
lsolve(a+x*y==z,x)
lsolve({3*x+5*y == 7, -2*x+10*y == -5}, {x, y});
`.trim(),
  },
  {
    name: 'Numeric tests',
    text: `
is_zero(0)
is_positive(-2)
is_negative(-2)
is_integer(2I)
is_pos_integer(-2)
is_nonneg_integer(-2)
is_even(2)
is_odd(2)
is_prime(7)
is_rational(1/2)
is_real(1/2)
is_cinteger(2-3I)
is_crational(2/3+7/2*I)`.trim(),
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
    name: 'Differentiate functions and expand them',
    text: `
diff(tan(x),x)
series(sin(x),x==0,4)
series(1/tan(x),x==0,4)
s = series(tgamma(x),x==0,3)
evalf(s)
series(tgamma(2*sin(x)-2),x==Pi/2,6)
`.trim(),
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
    name: 'Bitwise',
    text: `
not(-2)
or(8, 3)
and(15, 3)
xor(15, 3)
nand(15, 3)
nor(15, 3)
shiftleft(1, 3)
shiftright(8, 3)
`.trim(),
  },
  {
    name: 'Matrix',
    text: `
M = [[1, 3], [-3, 2]]
determinant(M)
trace(M)
rank(M)
transpose(M)
charpoly(M,lambda)
evalm([[1, 2]] + [[3, 4]])
evalm([[1, 2]] - [[3, 4]])
evalm([[1, 2]] * [[3], [4]])
evalm([[1, 2]] * 4)
evalm([[1, 2], [3, 4]]^(-1))
A = [ [1, 1], [2, -1] ]
A2 = A+2*M
evalm(A2)
B = [ [0, 0, a], [b, 1, -b], [-1/a, 0, 0] ]
evalm(B^(2^123))
diag_matrix({1, 2, 3})
unit_matrix(3, 4)
C = [[11, 12, 13], [21, 22, 23], [31, 32, 33]]
reduced_matrix(C, 1, 1)
sub_matrix(C, 1, 2, 1, 2)
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
isqrt(5)
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
