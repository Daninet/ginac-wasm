// #include <iostream>
#include <cstring>
#include <sstream>
#include <string>
// #include <stdexcept>
#include <emscripten.h>
// #include <emscripten/bind.h>
// #include <emscripten/val.h>
#include <ginac/ginac.h>
// #include <cmath>

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

// params always end in 0
// void discardRestFunctionParams() {
//   while (iobuffer[ioindex] != 0) {
//     parseType();
//   }

//   ioindex++;
// }

#define EXEC_SINGLE_PARAM_FN(FN_NAME, GINAC_FN) \
  {                                             \
    if (strcmp(name, FN_NAME) == 0) {           \
      auto param = parseType();                 \
      return GINAC_FN(param);                   \
    }                                           \
  }

#define EXEC_DOUBLE_PARAM_FN(FN_NAME, GINAC_FN) \
  {                                             \
    if (strcmp(name, FN_NAME) == 0) {           \
      auto param1 = parseType();                \
      auto param2 = parseType();                \
      return GINAC_FN(param1, param2);          \
    }                                           \
  }

#define EXEC_THREE_PARAM_FN(FN_NAME, GINAC_FN) \
  {                                            \
    if (strcmp(name, FN_NAME) == 0) {          \
      auto param1 = parseType();               \
      auto param2 = parseType();               \
      auto param3 = parseType();               \
      return GINAC_FN(param1, param2, param3); \
    }                                          \
  }

GiNaC::ex parseFunction() {
  char* name = &iobufferstr[ioindex];
  int nameLength = strlen(name);
  ioindex += nameLength + 1;

  EXEC_SINGLE_PARAM_FN("abs", GiNaC::abs)
  EXEC_SINGLE_PARAM_FN("sqrt", GiNaC::sqrt)
  EXEC_SINGLE_PARAM_FN("sin", GiNaC::sin)
  EXEC_SINGLE_PARAM_FN("cos", GiNaC::cos)
  EXEC_SINGLE_PARAM_FN("tan", GiNaC::tan)
  EXEC_SINGLE_PARAM_FN("exp", GiNaC::exp)
  EXEC_SINGLE_PARAM_FN("log", GiNaC::log)
  EXEC_SINGLE_PARAM_FN("asin", GiNaC::asin)
  EXEC_SINGLE_PARAM_FN("acos", GiNaC::acos)
  EXEC_SINGLE_PARAM_FN("atan", GiNaC::atan)
  EXEC_DOUBLE_PARAM_FN("atan2", GiNaC::atan2)
  EXEC_SINGLE_PARAM_FN("sinh", GiNaC::sinh)
  EXEC_SINGLE_PARAM_FN("cosh", GiNaC::cosh)
  EXEC_SINGLE_PARAM_FN("tanh", GiNaC::tanh)
  EXEC_SINGLE_PARAM_FN("asinh", GiNaC::asinh)
  EXEC_SINGLE_PARAM_FN("acosh", GiNaC::acosh)
  EXEC_SINGLE_PARAM_FN("atanh", GiNaC::atanh)
  EXEC_SINGLE_PARAM_FN("factorial", GiNaC::factorial)

  EXEC_SINGLE_PARAM_FN("eval", GiNaC::eval)
  EXEC_SINGLE_PARAM_FN("evalf", GiNaC::evalf)

  EXEC_SINGLE_PARAM_FN("factor", GiNaC::factor)
  if (strcmp(name, "factorall") == 0) {
    auto ex1 = parseType();
    return GiNaC::factor(ex1, GiNaC::factor_options::all);
  }

  EXEC_SINGLE_PARAM_FN("normal", GiNaC::normal)

  EXEC_SINGLE_PARAM_FN("numer", GiNaC::normal)
  EXEC_SINGLE_PARAM_FN("denom", GiNaC::normal)
  EXEC_SINGLE_PARAM_FN("numer_denom", GiNaC::normal)

  EXEC_DOUBLE_PARAM_FN("degree", GiNaC::degree)
  EXEC_DOUBLE_PARAM_FN("ldegree", GiNaC::ldegree)

  if (strcmp(name, "coeff") == 0) {
    auto ex1 = parseType();
    auto ex2 = parseType();
    auto nth = ex_to<GiNaC::numeric>(parseType());
    return GiNaC::coeff(ex1, ex2, nth.to_int());
  }

  EXEC_THREE_PARAM_FN("quo", GiNaC::quo)
  EXEC_THREE_PARAM_FN("rem", GiNaC::rem)
  EXEC_THREE_PARAM_FN("prem", GiNaC::prem)
  EXEC_THREE_PARAM_FN("divide", GiNaC::divide)

  if (strcmp(name, "series") == 0) {
    auto ex = parseType();
    auto r = parseType();
    auto order = ex_to<GiNaC::numeric>(parseType());
    return ex.series(r, order.to_int());
  }

  if (strcmp(name, "unit") == 0) {
    auto ex1 = parseType();
    auto ex2 = parseType();
    return ex1.unit(ex2);
  }

  if (strcmp(name, "content") == 0) {
    auto ex1 = parseType();
    auto ex2 = parseType();
    return ex1.content(ex2);
  }

  if (strcmp(name, "primpart") == 0) {
    auto ex1 = parseType();
    auto ex2 = parseType();
    return ex1.primpart(ex2);
  }

  if (strcmp(name, "primpart3") == 0) {
    auto ex1 = parseType();
    auto ex2 = parseType();
    auto ex3 = parseType();
    return ex1.primpart(ex2, ex3);
  }

  EXEC_DOUBLE_PARAM_FN("gcd", GiNaC::gcd)
  EXEC_DOUBLE_PARAM_FN("lcm", GiNaC::lcm)
  EXEC_THREE_PARAM_FN("resultant", GiNaC::resultant)

  if (strcmp(name, "lsolve") == 0) {
    auto ex = parseType();
    auto symbol = ex_to<GiNaC::symbol>(parseType());
    return GiNaC::lsolve(ex, symbol);
  }

  if (strcmp(name, "diff") == 0) {
    auto ex = parseType();
    auto symbol = ex_to<GiNaC::symbol>(parseType());
    auto nth = ex_to<GiNaC::numeric>(parseType());
    return GiNaC::diff(ex, symbol, nth.to_int());
  }

  return GiNaC::numeric(0);
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
      return parseFunction();
    case 0x04:
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

extern "C" {
uint32_t ginac_get_buffer() { return (uint32_t)iobuffer; }

void ginac_set_digits(uint32_t digits) { GiNaC::Digits = digits; }

void ginac_print() {
  auto res = parse();
  print_result(res);
  symbol_map.clear();
}
}
