// #include <iostream>
#include <emscripten.h>
#include <ginac/ginac.h>

#include <cstring>
#include <sstream>
#include <string>

using namespace GiNaC;
// using namespace emscripten;

volatile uint8_t iobuffer_raw[65000] = {0};
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

GiNaC::ex parseFunction1() {
  char* name = &iobufferstr[ioindex];
  int nameLength = strlen(name);
  ioindex += nameLength + 1;
  auto param = parseType();
  if (iobuffer[ioindex++] != 0) exit(1);

  if (strcmp(name, "abs") == 0) return GiNaC::abs(param);
  if (strcmp(name, "acos") == 0) return GiNaC::acos(param);
  if (strcmp(name, "acosh") == 0) return GiNaC::acosh(param);
  if (strcmp(name, "asin") == 0) return GiNaC::asin(param);
  if (strcmp(name, "asinh") == 0) return GiNaC::asinh(param);
  if (strcmp(name, "atan") == 0) return GiNaC::atan(param);
  if (strcmp(name, "atanh") == 0) return GiNaC::atanh(param);
  if (strcmp(name, "cos") == 0) return GiNaC::cos(param);
  if (strcmp(name, "cosh") == 0) return GiNaC::cosh(param);
  if (strcmp(name, "denom") == 0) return GiNaC::normal(param);
  if (strcmp(name, "eval") == 0) return GiNaC::eval(param);
  if (strcmp(name, "evalf") == 0) return GiNaC::evalf(param);
  if (strcmp(name, "exp") == 0) return GiNaC::exp(param);
  if (strcmp(name, "factor") == 0) return GiNaC::factor(param);
  if (strcmp(name, "factorial") == 0) return GiNaC::factorial(param);
  if (strcmp(name, "log") == 0) return GiNaC::log(param);
  if (strcmp(name, "normal") == 0) return GiNaC::normal(param);
  if (strcmp(name, "numer_denom") == 0) return GiNaC::normal(param);
  if (strcmp(name, "numer") == 0) return GiNaC::normal(param);
  if (strcmp(name, "sin") == 0) return GiNaC::sin(param);
  if (strcmp(name, "sinh") == 0) return GiNaC::sinh(param);
  if (strcmp(name, "sqrt") == 0) return GiNaC::sqrt(param);
  if (strcmp(name, "tan") == 0) return GiNaC::tan(param);
  if (strcmp(name, "tanh") == 0) return GiNaC::tanh(param);

  if (strcmp(name, "factorall") == 0) {
    auto ex1 = parseType();
    ioindex++;
    return GiNaC::factor(ex1, GiNaC::factor_options::all);
  }

  exit(1);
}

GiNaC::ex parseFunction2() {
  char* name = &iobufferstr[ioindex];
  int nameLength = strlen(name);
  ioindex += nameLength + 1;
  auto param1 = parseType();
  auto param2 = parseType();
  if (iobuffer[ioindex++] != 0) exit(1);

  if (strcmp(name, "atan2") == 0) return GiNaC::atan2(param1, param2);
  if (strcmp(name, "content") == 0) return param1.content(param2);
  if (strcmp(name, "degree") == 0) return GiNaC::degree(param1, param2);
  if (strcmp(name, "gcd") == 0) return GiNaC::gcd(param1, param2);
  if (strcmp(name, "lcm") == 0) return GiNaC::lcm(param1, param2);
  if (strcmp(name, "ldegree") == 0) return GiNaC::ldegree(param1, param2);
  if (strcmp(name, "lsolve") == 0)
    return GiNaC::lsolve(param1, ex_to<GiNaC::symbol>(param2));
  if (strcmp(name, "primpart") == 0) return param1.primpart(param2);
  if (strcmp(name, "unit") == 0) return param1.unit(param2);

  exit(1);
}

GiNaC::ex parseFunction3() {
  char* name = &iobufferstr[ioindex];
  int nameLength = strlen(name);
  ioindex += nameLength + 1;
  auto param1 = parseType();
  auto param2 = parseType();
  auto param3 = parseType();
  if (iobuffer[ioindex++] != 0) exit(1);

  if (strcmp(name, "coeff") == 0)
    return GiNaC::coeff(param1, param2, ex_to<GiNaC::numeric>(param3).to_int());
  if (strcmp(name, "quo") == 0) return GiNaC::quo(param1, param2, param3);
  if (strcmp(name, "rem") == 0) return GiNaC::rem(param1, param2, param3);
  if (strcmp(name, "prem") == 0) return GiNaC::prem(param1, param2, param3);
  if (strcmp(name, "divide") == 0) return GiNaC::divide(param1, param2, param3);
  if (strcmp(name, "series") == 0)
    return param1.series(param2, ex_to<GiNaC::numeric>(param3).to_int());
  if (strcmp(name, "resultant") == 0)
    return GiNaC::resultant(param1, param2, param3);
  if (strcmp(name, "diff") == 0)
    return GiNaC::diff(param1, ex_to<GiNaC::symbol>(param2),
                       ex_to<GiNaC::numeric>(param3).to_int());
  if (strcmp(name, "primpart3") == 0) return param1.primpart(param2, param3);

  exit(1);
}

GiNaC::ex parseExpression() {
  GiNaC::ex res(parseType());

  while (iobuffer[ioindex] != 0) {
    char op = iobuffer[ioindex++];
    switch (op) {
      case '+':
        res += parseType();
        break;
      case '-':
        res -= parseType();
        break;
      case '*':
        res *= parseType();
        break;
      case '/':
        res /= parseType();
        break;
      case '^':
        res = GiNaC::pow(res, parseType());
        break;
    }
  }
  ioindex++;
  return res;
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
    case 0x10:
      return parseType() == parseType();
    case 0x11:
      return parseType() != parseType();
    case 0x12:
      return parseType() < parseType();
    case 0x13:
      return parseType() <= parseType();
    case 0x14:
      return parseType() > parseType();
    case 0x15:
      return parseType() >= parseType();
    case 0x21:
      return parseFunction1();
    case 0x22:
      return parseFunction2();
    case 0x23:
      return parseFunction3();
    case 0xA0:
      return GiNaC::Pi;
    case 0xA1:
      return GiNaC::Euler;
    case 0xA2:
      return GiNaC::Catalan;
  }
  return GiNaC::ex(0);
}

GiNaC::ex parse() {
  ioindex = 0;
  return parseType();
}

// EM_ASM({
//   console.log('from c', $0, $1, $2)
// }, iobuffer, iobuffer[0], iobuffer[1]);

void print_result(GiNaC::ex& res) {
  std::ostringstream ss;
  ss << res;
  std::string s = ss.str();
  const char* cstr = s.c_str();
  strcpy(iobufferstr, cstr);
}

GiNaC::parser reader;

extern "C" {

uint32_t ginac_get_buffer() { return (uint32_t)iobuffer; }

void ginac_set_digits(uint32_t digits) { GiNaC::Digits = digits; }

void ginac_parse_print() {
  auto res = reader(iobufferstr);
  print_result(res);
  symbol_map.clear();
}

void ginac_print() {
  auto res = parse();
  print_result(res);
  symbol_map.clear();
}
}
