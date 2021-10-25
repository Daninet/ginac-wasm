.ONESHELL:
SHELL := /bin/bash
.SHELLFLAGS = -ec


# ifneq ($(RELEASE),)
extra_flags := -flto -Oz -O3
build := build/release
# else
# extra_flags := -g
# build := build/debug
# endif

ROOT_DIR := $(PWD)
PREFIX := $(ROOT_DIR)/$(build)/install
CFLAGS := -I$(PREFIX)/include $(extra_flags)
CXXFLAGS = $(CFLAGS) -std=c++11 -DEMSCRIPTEN_HAS_UNBOUND_TYPE_NAMES=0 # -fno-exceptions  -fno-rtti
LDFLAGS := -L$(PREFIX)/lib $(extra_flags) # -fno-rtti

prepend = $(foreach a,$(2),$(1)$(a))
libfiles = $(foreach lib,$(1),$(LIBDIR)/lib$(lib).a)

LIBDIR := $(build)/install/lib
ALL_LIBS := cln

libreqs = $(call libfiles,$($(1)_REQS))

GINACWASM_LIBS := cln ginac

GINAC_VER := 1.8.1
GINAC_REQS := cln
GINAC_URL = https://www.ginac.de/ginac-$(1).tar.bz2

EMSDK_VER := 2.0.32
EMSDK_URL = https://github.com/emscripten-core/emsdk/archive/$(1).tar.gz

# GMP_VER := 6.2.1
# GMP_CHKSUM := sha-256=fd4829912cddd12f84181c3451cc752be224643e87fac497b69edddadc49b4f2
# GMP_URL = https://ftp.gnu.org/gnu/gmp/gmp-$(1).tar.xz \

# MPFR_VER := 4.1.0
# MPFR_CHKSUM := sha-256=0c98a3f1732ff6ca4ea690552079da9c597872d30e96ec28414ee23c95558a7f
# MPFR_REQS := gmp
# MPFR_URL = https://ftp.gnu.org/gnu/mpfr/mpfr-$(1).tar.xz

CLN_VER := 1.3.6
CLN_URL = https://www.ginac.de/CLN/cln-$(1).tar.bz2 \

PUBLIC_FILES = $(build)/ginac.js $(build)/ginac.wasm

.PHONY: default
default: $(PUBLIC_FILES)

download_tarball = \
    aria2c $(if $($(1)_CHKSUM),--check-integrity=true) --auto-file-renaming=false \
		$(call $(1)_URL,$($(1)_VER)) --out=$@ $(if $($(1)_CHKSUM),--checksum=$($(1)_CHKSUM))
lib/ginac.tar.bz2:
	$(call download_tarball,GINAC)
lib/emsdk.tar.gz:
	$(call download_tarball,EMSDK)
# lib/gmp.tar.xz:
# 	$(call download_tarball,GMP)
# lib/mpfr.tar.xz:
# 	$(call download_tarball,MPFR)
lib/cln.tar.bz2:
	$(call download_tarball,CLN)

untar = tar xmf $< -C $(@D) && rm -rf $@ && mv $@-* $@
lib/emsdk: lib/emsdk.tar.gz
	$(untar)
# lib/gmp: lib/gmp.tar.xz
# 	$(untar)
# lib/mpfr: lib/mpfr.tar.xz
# 	$(untar)
lib/cln: lib/cln.tar.bz2
	$(untar)
lib/ginac: lib/ginac.tar.bz2
	$(untar)

ACTIVATE_EMSDK := lib/emsdk/upstream/.emsdk_version
EMSDK_ENV := . lib/emsdk/emsdk_env.sh >/dev/null 2>&1

$(ACTIVATE_EMSDK): | lib/emsdk
	$|/emsdk install $(EMSDK_VER)
	$|/emsdk activate $(EMSDK_VER)

CD_BUILDDIR = mkdir -p $(@D) && cd $(@D)

# $(build)/gmp/Makefile: $(ACTIVATE_EMSDK) $(call libreqs,GMP) | lib/gmp
# 	$(EMSDK_ENV)
# 	$(CD_BUILDDIR)
# 	emconfigure $(ROOT_DIR)/lib/gmp/configure --host none --prefix="$(PREFIX)" \
# 		--disable-assembly --disable-cxx --disable-fft \
# 		--enable-alloca=notreentrant

# $(build)/mpfr/Makefile: $(ACTIVATE_EMSDK) $(call libreqs,MPFR) | lib/mpfr
# 	$(EMSDK_ENV)
# 	$(CD_BUILDDIR)
# 	autoreconf -if -Wall $(ROOT_DIR)/lib/mpfr
# 	emconfigure $(ROOT_DIR)/lib/mpfr/configure --host none --prefix="$(PREFIX)" \
# 		--disable-thread-safe --enable-decimal-float=no \
# 		--with-gmp=$(PREFIX)

$(build)/cln/Makefile: $(ACTIVATE_EMSDK) $(call libreqs,CLN) | lib/cln
	$(EMSDK_ENV)
	$(CD_BUILDDIR)
	emconfigure $(ROOT_DIR)/lib/cln/configure --host none --prefix="$(PREFIX)" --without-gmp CPPFLAGS=-DNO_ASM

$(build)/ginac/Makefile: $(ACTIVATE_EMSDK) $(call libreqs,GINAC) | lib/ginac
	$(EMSDK_ENV)
	$(CD_BUILDDIR)
	[[ -f $(ROOT_DIR)/lib/ginac/configure ]] || NOCONFIGURE=true $(ROOT_DIR)/lib/ginac/autogen.sh
	CFLAGS="-I$(PREFIX)/include" CXXFLAGS="$(CXXFLAGS)" LDFLAGS="-L$(PREFIX)/lib" \
	    emconfigure $(ROOT_DIR)/lib/ginac/configure --host none --prefix="$(PREFIX)" PKG_CONFIG_PATH="$(PREFIX)/lib/pkgconfig"

submake_args = -j4 -C $(<D) CFLAGS="$(CFLAGS)" CXXFLAGS="$(CXXFLAGS)" LDFLAGS="$(LDFLAGS)"

# $(LIBDIR)/libgmp.a: $(build)/gmp/Makefile | lib/gmp
# 	$(EMSDK_ENV)
# 	$(MAKE) $(submake_args) install

# $(LIBDIR)/libmpfr.a: $(build)/mpfr/Makefile | lib/mpfr
# 	$(EMSDK_ENV)
# 	$(MAKE) $(submake_args) install

$(LIBDIR)/libcln.a: $(build)/cln/Makefile | lib/cln
	$(EMSDK_ENV)
	$(MAKE) $(submake_args) install

$(LIBDIR)/libginac.a: $(build)/ginac/Makefile | lib/ginac
	$(EMSDK_ENV)
	$(MAKE) $(submake_args) install

OBJS = $(patsubst src/%.cpp,src/%.o,$(wildcard src/*.cpp))

src/%.o: src/%.cpp $(LIBDIR)/libginac.a
	$(EMSDK_ENV)
	emcc --bind $(CXXFLAGS) -Oz -c $< -o $@

$(build)/ginac.js $(build)/ginac.wasm &: $(OBJS) $(call libfiles,$(GINACWASM_LIBS))
	$(EMSDK_ENV)
	mkdir -p $(@D)
	emcc \
	    --bind \
	    $(LDFLAGS) \
	    -s WARN_UNALIGNED=1 -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s FILESYSTEM=1 -s ASSERTIONS=1 \
			-s EXPORTED_FUNCTIONS='["_ginac_get_buffer", "_ginac_print", "_ginac_lsolve", "_ginac_set_digits"]' \
			-s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]'\
	    $(call prepend,-l,$(GINACWASM_LIBS)) \
	    $(OBJS) \
	    -o $(build)/ginac.js

.PHONY: clean
clean:
	rm -rf $(OBJS) build/

.PHONY: clean-deps
clean-deps:
	rm -f $(call libfiles,$(ALL_LIBS))
	$(foreach libdir,$(call prepend,$(build)/,$(ALL_LIBS)),[ -d $(libdir) ] && $(MAKE) -C $(libdir) clean
	)@true
