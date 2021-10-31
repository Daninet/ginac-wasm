// #include <iostream>
#include <cln/integer.h>
#include <emscripten.h>
#include <ginac/ginac.h>

#include <cstring>
#include <sstream>
#include <string>

using namespace GiNaC;
// using namespace emscripten;

volatile uint8_t iobuffer_raw[65536] = {0};
uint8_t* iobuffer = (uint8_t*)iobuffer_raw;
char* iobufferstr = (char*)iobuffer_raw;

int ioindex = 0;

static std::map<std::string, GiNaC::symbol> symbol_map;

const GiNaC::symbol& get_symbol(const std::string& s) {
  auto i = symbol_map.find(s);

  if (i != symbol_map.end()) {
    return i->second;
  } else {
    return symbol_map.insert(make_pair(s, GiNaC::symbol(s))).first->second;
  }
}

GiNaC::ex parseType();

std::string parseCString() {
  std::string str(&iobufferstr[ioindex]);
  ioindex += str.length() + 1;
  return str;
}

GiNaC::lst expressions;

GiNaC::ex parseRef() {
  auto index = GiNaC::ex_to<GiNaC::numeric>(parseType()).to_int();
  return expressions[index];
}

GiNaC::ex parseDigits() {
  auto digits = GiNaC::ex_to<GiNaC::numeric>(parseType());
  GiNaC::Digits = digits.to_int();
  return digits;
}

GiNaC::ex parseExpression() { return GiNaC::ex(parseType()); }

GiNaC::ex parseNumber() {
  auto str = parseCString();
  GiNaC::numeric x(str.c_str());
  return GiNaC::ex(x);
}

GiNaC::ex parseSymbol() {
  auto str = parseCString();
  auto x = get_symbol(str);
  return GiNaC::ex(x);
}

GiNaC::ex parseList() {
  GiNaC::lst lst;
  while (iobufferstr[ioindex] != 0) {
    lst.append(parseType());
  }
  ioindex++;
  return lst;
}

GiNaC::ex parseMatrix() {
  int rows = ex_to<GiNaC::numeric>(parseType()).to_int();
  int cols = ex_to<GiNaC::numeric>(parseType()).to_int();
  auto lst = ex_to<GiNaC::lst>(parseType());
  ioindex++;
  GiNaC::matrix matrix(rows, cols, lst);
  return matrix;
}

#define FN_CMP(LEN, PTR, LITERAL) \
  (((LEN) == sizeof(LITERAL) - 1) && (strcmp((PTR), (LITERAL)) == 0))

GiNaC::ex parseFunction1() {
  char* name = &iobufferstr[ioindex];
  size_t len = strlen(name);
  ioindex += len + 1;
  auto param = parseType();
  if (iobuffer[ioindex++] != 0) exit(1);

  if (FN_CMP(len, name, "abs")) return GiNaC::abs(param);
  if (FN_CMP(len, name, "acos")) return GiNaC::acos(param);
  if (FN_CMP(len, name, "acosh")) return GiNaC::acosh(param);
  if (FN_CMP(len, name, "asin")) return GiNaC::asin(param);
  if (FN_CMP(len, name, "asinh")) return GiNaC::asinh(param);
  if (FN_CMP(len, name, "atan")) return GiNaC::atan(param);
  if (FN_CMP(len, name, "atanh")) return GiNaC::atanh(param);
  if (FN_CMP(len, name, "conjugate")) return GiNaC::conjugate(param);
  if (FN_CMP(len, name, "cos")) return GiNaC::cos(param);
  if (FN_CMP(len, name, "cosh")) return GiNaC::cosh(param);
  if (FN_CMP(len, name, "csgn")) return GiNaC::csgn(param);
  if (FN_CMP(len, name, "denom")) return GiNaC::denom(param);
  if (FN_CMP(len, name, "determinant")) {
    return GiNaC::determinant(ex_to<GiNaC::matrix>(param));
  }
  if (FN_CMP(len, name, "diag_matrix")) {
    return GiNaC::diag_matrix(ex_to<GiNaC::lst>(param));
  }
  if (FN_CMP(len, name, "EllipticE")) return GiNaC::EllipticE(param);
  if (FN_CMP(len, name, "EllipticK")) return GiNaC::EllipticK(param);
  if (FN_CMP(len, name, "eval")) return GiNaC::eval(param);
  if (FN_CMP(len, name, "evalf")) return GiNaC::evalf(param);
  if (FN_CMP(len, name, "evalm")) return GiNaC::evalm(param);
  if (FN_CMP(len, name, "exp")) return GiNaC::exp(param);
  if (FN_CMP(len, name, "expand")) return GiNaC::expand(param);
  if (FN_CMP(len, name, "factor")) return GiNaC::factor(param);
  if (FN_CMP(len, name, "factorall")) {
    return GiNaC::factor(param, GiNaC::factor_options::all);
  }
  if (FN_CMP(len, name, "factorial")) return GiNaC::factorial(param);
  if (FN_CMP(len, name, "imag_part")) return GiNaC::imag_part(param);
  if (FN_CMP(len, name, "inverse")) {
    return GiNaC::inverse(ex_to<GiNaC::matrix>(param));
  }
  if (FN_CMP(len, name, "lgamma")) return GiNaC::lgamma(param);
  if (FN_CMP(len, name, "Li2")) return GiNaC::Li2(param);
  if (FN_CMP(len, name, "log")) return GiNaC::log(param);
  if (FN_CMP(len, name, "normal")) return GiNaC::normal(param);
  if (FN_CMP(len, name, "not")) {
    auto num = GiNaC::ex_to<GiNaC::numeric>(param).to_cl_N();
    return GiNaC::numeric(cln::lognot(cln::the<cln::cl_I>(num)));
  }
  if (FN_CMP(len, name, "numer_denom")) return GiNaC::numer_denom(param);
  if (FN_CMP(len, name, "numer")) return GiNaC::numer(param);
  if (FN_CMP(len, name, "Order")) return GiNaC::Order(param);
  if (FN_CMP(len, name, "psi")) return GiNaC::psi(param);
  if (FN_CMP(len, name, "rank")) {
    return GiNaC::rank(ex_to<GiNaC::matrix>(param));
  }
  if (FN_CMP(len, name, "real_part")) return GiNaC::real_part(param);
  if (FN_CMP(len, name, "sin")) return GiNaC::sin(param);
  if (FN_CMP(len, name, "sinh")) return GiNaC::sinh(param);
  if (FN_CMP(len, name, "sqrt")) return GiNaC::sqrt(param);
  if (FN_CMP(len, name, "step")) return GiNaC::step(param);
  if (FN_CMP(len, name, "tan")) return GiNaC::tan(param);
  if (FN_CMP(len, name, "tanh")) return GiNaC::tanh(param);
  if (FN_CMP(len, name, "tgamma")) return GiNaC::tgamma(param);
  if (FN_CMP(len, name, "trace")) {
    return GiNaC::trace(ex_to<GiNaC::matrix>(param));
  }
  if (FN_CMP(len, name, "zeta")) return GiNaC::zeta(param);

  exit(1);
}

GiNaC::ex parseFunction2() {
  char* name = &iobufferstr[ioindex];
  size_t len = strlen(name);
  ioindex += len + 1;
  auto param1 = parseType();
  auto param2 = parseType();
  if (iobuffer[ioindex++] != 0) exit(1);

  if (FN_CMP(len, name, "add")) return param1 + param2;
  if (FN_CMP(len, name, "and")) {
    auto num1 = GiNaC::ex_to<GiNaC::numeric>(param1).to_cl_N();
    auto num2 = GiNaC::ex_to<GiNaC::numeric>(param2).to_cl_N();
    return GiNaC::numeric(
        cln::logand(cln::the<cln::cl_I>(num1), cln::the<cln::cl_I>(num2)));
  }
  if (FN_CMP(len, name, "atan2")) return GiNaC::atan2(param1, param2);
  if (FN_CMP(len, name, "beta")) return GiNaC::beta(param1, param2);
  if (FN_CMP(len, name, "binomial")) return GiNaC::binomial(param1, param2);
  if (FN_CMP(len, name, "charpoly")) {
    return GiNaC::charpoly(ex_to<GiNaC::matrix>(param1), param2);
  }
  if (FN_CMP(len, name, "collect")) return GiNaC::collect(param1, param2);
  if (FN_CMP(len, name, "content")) return param1.content(param2);
  if (FN_CMP(len, name, "degree")) return GiNaC::degree(param1, param2);
  if (FN_CMP(len, name, "div")) return param1 / param2;
  if (FN_CMP(len, name, "eta")) return GiNaC::eta(param1, param2);
  if (FN_CMP(len, name, "equal")) return param1 == param2;
  if (FN_CMP(len, name, "G")) return GiNaC::G(param1, param2);
  if (FN_CMP(len, name, "gcd")) return GiNaC::gcd(param1, param2);
  if (FN_CMP(len, name, "greaterThan")) return param1 > param2;
  if (FN_CMP(len, name, "greaterThanOrEqualTo")) return param1 >= param2;
  if (FN_CMP(len, name, "H")) return GiNaC::H(param1, param2);
  if (FN_CMP(len, name, "iterated_integral")) {
    return GiNaC::iterated_integral(param1, param2);
  }
  if (FN_CMP(len, name, "lcm")) return GiNaC::lcm(param1, param2);
  if (FN_CMP(len, name, "ldegree")) return GiNaC::ldegree(param1, param2);
  if (FN_CMP(len, name, "lessThan")) return param1 < param2;
  if (FN_CMP(len, name, "lessThanOrEqualTo")) return param1 <= param2;
  if (FN_CMP(len, name, "Li")) return GiNaC::Li(param1, param2);
  if (FN_CMP(len, name, "lsolve")) {
    return GiNaC::lsolve(param1, ex_to<GiNaC::symbol>(param2));
  }
  if (FN_CMP(len, name, "mul")) return param1 * param2;
  if (FN_CMP(len, name, "nand")) {
    auto num1 = GiNaC::ex_to<GiNaC::numeric>(param1).to_cl_N();
    auto num2 = GiNaC::ex_to<GiNaC::numeric>(param2).to_cl_N();
    return GiNaC::numeric(
        cln::lognand(cln::the<cln::cl_I>(num1), cln::the<cln::cl_I>(num2)));
  }
  if (FN_CMP(len, name, "nor")) {
    auto num1 = GiNaC::ex_to<GiNaC::numeric>(param1).to_cl_N();
    auto num2 = GiNaC::ex_to<GiNaC::numeric>(param2).to_cl_N();
    return GiNaC::numeric(
        cln::lognor(cln::the<cln::cl_I>(num1), cln::the<cln::cl_I>(num2)));
  }
  if (FN_CMP(len, name, "notEqual")) return param1 != param2;
  if (FN_CMP(len, name, "or")) {
    auto num1 = GiNaC::ex_to<GiNaC::numeric>(param1).to_cl_N();
    auto num2 = GiNaC::ex_to<GiNaC::numeric>(param2).to_cl_N();
    return GiNaC::numeric(
        cln::logior(cln::the<cln::cl_I>(num1), cln::the<cln::cl_I>(num2)));
  }
  if (FN_CMP(len, name, "pow")) return GiNaC::pow(param1, param2);
  if (FN_CMP(len, name, "primpart")) return param1.primpart(param2);
  if (FN_CMP(len, name, "psi2")) return GiNaC::psi(param1, param2);
  if (FN_CMP(len, name, "shiftLeft")) {
    auto num1 = GiNaC::ex_to<GiNaC::numeric>(param1).to_cl_N();
    auto num2 = GiNaC::ex_to<GiNaC::numeric>(param2).to_cl_N();
    return GiNaC::numeric(cln::the<cln::cl_I>(num1)
                          << cln::the<cln::cl_I>(num2));
  }
  if (FN_CMP(len, name, "shiftRight")) {
    auto num1 = GiNaC::ex_to<GiNaC::numeric>(param1).to_cl_N();
    auto num2 = GiNaC::ex_to<GiNaC::numeric>(param2).to_cl_N();
    return GiNaC::numeric(cln::the<cln::cl_I>(num1) >>
                          cln::the<cln::cl_I>(num2));
  }
  if (FN_CMP(len, name, "sub")) return param1 - param2;
  if (FN_CMP(len, name, "subs")) return GiNaC::subs(param1, param2);
  if (FN_CMP(len, name, "unit")) return param1.unit(param2);
  if (FN_CMP(len, name, "unit_matrix")) {
    return GiNaC::unit_matrix(ex_to<GiNaC::numeric>(param1).to_int(),
                              ex_to<GiNaC::numeric>(param2).to_int());
  }
  if (FN_CMP(len, name, "xor")) {
    auto num1 = GiNaC::ex_to<GiNaC::numeric>(param1).to_cl_N();
    auto num2 = GiNaC::ex_to<GiNaC::numeric>(param2).to_cl_N();
    return GiNaC::numeric(
        cln::logxor(cln::the<cln::cl_I>(num1), cln::the<cln::cl_I>(num2)));
  }
  if (FN_CMP(len, name, "zeta2")) return GiNaC::zeta(param1, param2);
  if (FN_CMP(len, name, "zetaderiv")) return GiNaC::zetaderiv(param1, param2);

  exit(1);
}

GiNaC::ex parseFunction3() {
  char* name = &iobufferstr[ioindex];
  size_t len = strlen(name);
  ioindex += len + 1;
  auto param1 = parseType();
  auto param2 = parseType();
  auto param3 = parseType();
  if (iobuffer[ioindex++] != 0) exit(1);

  if (FN_CMP(len, name, "coeff")) {
    return GiNaC::coeff(param1, param2, ex_to<GiNaC::numeric>(param3).to_int());
  }
  if (FN_CMP(len, name, "diff")) {
    return GiNaC::diff(param1, ex_to<GiNaC::symbol>(param2),
                       ex_to<GiNaC::numeric>(param3).to_int());
  }
  if (FN_CMP(len, name, "divide")) return GiNaC::divide(param1, param2, param3);
  if (FN_CMP(len, name, "G3")) return GiNaC::G(param1, param2, param3);
  if (FN_CMP(len, name, "iterated_integral3")) {
    return GiNaC::iterated_integral(param1, param2, param3);
  }
  if (FN_CMP(len, name, "prem")) return GiNaC::prem(param1, param2, param3);
  if (FN_CMP(len, name, "primpart3")) return param1.primpart(param2, param3);
  if (FN_CMP(len, name, "quo")) return GiNaC::quo(param1, param2, param3);
  if (FN_CMP(len, name, "rem")) return GiNaC::rem(param1, param2, param3);
  if (FN_CMP(len, name, "reduced_matrix")) {
    return GiNaC::reduced_matrix(ex_to<GiNaC::matrix>(param1),
                                 ex_to<GiNaC::numeric>(param2).to_int(),
                                 ex_to<GiNaC::numeric>(param3).to_int());
  }
  if (FN_CMP(len, name, "resultant")) {
    return GiNaC::resultant(param1, param2, param3);
  }
  if (FN_CMP(len, name, "S")) return GiNaC::S(param1, param2, param3);
  if (FN_CMP(len, name, "series")) {
    return param1.series(param2, ex_to<GiNaC::numeric>(param3).to_int());
  }

  exit(1);
}

GiNaC::ex parseFunction4() {
  char* name = &iobufferstr[ioindex];
  size_t len = strlen(name);
  ioindex += len + 1;
  auto param1 = parseType();
  auto param2 = parseType();
  auto param3 = parseType();
  auto param4 = parseType();
  if (iobuffer[ioindex++] != 0) exit(1);

  if (FN_CMP(len, name, "fsolve")) {
    return GiNaC::fsolve(param1, ex_to<GiNaC::symbol>(param2),
                         ex_to<GiNaC::numeric>(param3),
                         ex_to<GiNaC::numeric>(param4));
  }

  exit(1);
}

GiNaC::ex parseFunction5() {
  char* name = &iobufferstr[ioindex];
  size_t len = strlen(name);
  ioindex += len + 1;
  auto param1 = parseType();
  auto param2 = parseType();
  auto param3 = parseType();
  auto param4 = parseType();
  auto param5 = parseType();
  if (iobuffer[ioindex++] != 0) exit(1);

  if (FN_CMP(len, name, "sub_matrix")) {
    return GiNaC::sub_matrix(ex_to<GiNaC::matrix>(param1),
                             ex_to<GiNaC::numeric>(param2).to_int(),
                             ex_to<GiNaC::numeric>(param3).to_int(),
                             ex_to<GiNaC::numeric>(param4).to_int(),
                             ex_to<GiNaC::numeric>(param5).to_int());
  }

  exit(1);
}

GiNaC::ex parseType() {
  ioindex++;
  switch (iobuffer[ioindex - 1]) {
    case 0x01:
      return parseExpression();
    case 0x02:
      return parseNumber();
    case 0x03:
      return parseSymbol();
    case 0x04:
      return parseList();
    case 0x05:
      return parseMatrix();
    case 0x06:
      return parseRef();
    case 0x0F:
      return parseDigits();
    case 0x21:
      return parseFunction1();
    case 0x22:
      return parseFunction2();
    case 0x23:
      return parseFunction3();
    case 0x24:
      return parseFunction4();
    case 0x25:
      return parseFunction5();
    case 0xA0:
      return GiNaC::Pi;
    case 0xA1:
      return GiNaC::Euler;
    case 0xA2:
      return GiNaC::Catalan;
  }

  exit(1);
}

GiNaC::lst parse() {
  ioindex = 0;
  while (iobuffer[ioindex] != 0) {
    auto res = parseType();
    expressions.append(res);
  }
  return expressions;
}

// EM_ASM({
//   console.log('from c', $0, $1, $2)
// }, iobuffer, iobuffer[0], iobuffer[1]);

size_t print_result(GiNaC::ex& res, size_t index) {
  std::ostringstream ss;
  ss << res;
  std::string s = ss.str();
  size_t str_size = s.size();
  uint32_t* size_ptr = (uint32_t*)(iobufferstr + index);
  *size_ptr = str_size;
  const char* cstr = s.c_str();
  memcpy(iobufferstr + index + 4, cstr, str_size);
  return 4 + str_size;
}

void print_result_list(GiNaC::lst& lst) {
  size_t index = 0;
  for (lst::const_iterator i = lst.begin(); i != lst.end(); ++i) {
    auto ex = *i;
    index += print_result(ex, index);
  }
  uint32_t* size_ptr = (uint32_t*)(iobufferstr + index);
  *size_ptr = 0;
}

extern "C" {

uint32_t ginac_get_buffer() { return (uint32_t)iobuffer; }

void ginac_parse_print() {
  GiNaC::Digits = 17;
  GiNaC::parser reader;
  GiNaC::lst lst;
  size_t index = 0;
  while (iobufferstr[index] != 0) {
    size_t len = strlen(iobufferstr + index);
    auto res = reader(iobufferstr + index);
    lst.append(res);
    index += len + 1;
  }
  print_result_list(lst);
}

void ginac_print() {
  GiNaC::Digits = 17;
  auto lst = parse();
  print_result_list(lst);
  expressions.remove_all();
  symbol_map.clear();
}
}
