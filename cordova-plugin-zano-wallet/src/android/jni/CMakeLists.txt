cmake_minimum_required(VERSION 3.10.2)

project(zanowallet_jni)

# Set C++ standard
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Get the Android ABI
if(NOT ANDROID_ABI)
    set(ANDROID_ABI ${CMAKE_ANDROID_ARCH_ABI})
endif()

message(STATUS "Building Zano Wallet JNI for ABI: ${ANDROID_ABI}")

# Path to plugin root (this CMakeLists.txt is in src/android/jni/)
get_filename_component(PLUGIN_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../../.. ABSOLUTE)
message(STATUS "Plugin root: ${PLUGIN_ROOT}")

# Path to pre-built Zano libraries (copied by install hook)
set(ZANO_LIBS_DIR ${PLUGIN_ROOT}/native/android/${ANDROID_ABI}/lib)
set(ZANO_INCLUDE_DIR ${PLUGIN_ROOT}/native/android/include)
set(BOOST_LIBS_DIR ${PLUGIN_ROOT}/native/android/boost/${ANDROID_ABI}/lib)
set(OPENSSL_LIBS_DIR ${PLUGIN_ROOT}/native/android/openssl/${ANDROID_ABI}/lib)

# Fallback to check if running from main repo (for local development)
if(NOT EXISTS ${ZANO_LIBS_DIR})
    get_filename_component(REPO_ROOT ${PLUGIN_ROOT}/.. ABSOLUTE)
    set(ZANO_LIBS_DIR ${REPO_ROOT}/_install_android/${ANDROID_ABI}/lib)
    set(ZANO_INCLUDE_DIR ${REPO_ROOT}/_install_android/include)
    set(BOOST_LIBS_DIR ${REPO_ROOT}/_libs_android/boost/${ANDROID_ABI}/lib)
    set(OPENSSL_LIBS_DIR ${REPO_ROOT}/_libs_android/openssl/${ANDROID_ABI}/lib)
    message(STATUS "Using libraries from main repo")
endif()

message(STATUS "Libraries directory: ${ZANO_LIBS_DIR}")
message(STATUS "Include directory: ${ZANO_INCLUDE_DIR}")

# Check if libraries exist
if(NOT EXISTS ${ZANO_LIBS_DIR}/libwallet.a)
    message(FATAL_ERROR "Zano libraries not found! Expected at: ${ZANO_LIBS_DIR}")
endif()

# Include directories
include_directories(
    ${ZANO_INCLUDE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Source files
set(JNI_SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/zano_wallet_jni.cpp
)

# Create shared library
add_library(zanowallet_jni SHARED ${JNI_SOURCES})

# Link pre-built static libraries
# Note: Order matters for static library linking - most dependent first
target_link_libraries(zanowallet_jni
    # Zano libraries
    ${ZANO_LIBS_DIR}/libwallet.a
    ${ZANO_LIBS_DIR}/libcurrency_core.a
    ${ZANO_LIBS_DIR}/libcommon.a
    ${ZANO_LIBS_DIR}/libcrypto.a
    ${ZANO_LIBS_DIR}/libz.a

    # Boost libraries
    ${BOOST_LIBS_DIR}/libboost_serialization.a
    ${BOOST_LIBS_DIR}/libboost_filesystem.a
    ${BOOST_LIBS_DIR}/libboost_system.a
    ${BOOST_LIBS_DIR}/libboost_thread.a
    ${BOOST_LIBS_DIR}/libboost_chrono.a
    ${BOOST_LIBS_DIR}/libboost_regex.a
    ${BOOST_LIBS_DIR}/libboost_program_options.a
    ${BOOST_LIBS_DIR}/libboost_date_time.a
    ${BOOST_LIBS_DIR}/libboost_atomic.a

    # OpenSSL libraries
    ${OPENSSL_LIBS_DIR}/libssl.a
    ${OPENSSL_LIBS_DIR}/libcrypto.a

    # System libraries
    log
    android
)

# Compiler flags
target_compile_options(zanowallet_jni PRIVATE
    -fPIC
    -fexceptions
    -frtti
    -Wall
    -Wno-unused-parameter
)

# Linker flags
set_target_properties(zanowallet_jni PROPERTIES
    LINK_FLAGS "-Wl,--exclude-libs,ALL"
)
