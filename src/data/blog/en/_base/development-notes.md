---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: Development Notes
slug: development-notes
featured: false
draft: false
tags:
  - note
description:
  This article records problems encountered during the development process, their solutions, and unclear knowledge points.
---

## Git Commands

### git log
Get all commit records, output by line.

#### --pretty parameter
Set the output format, such as: `--pretty=format:%s %h` parameter, where %s refers to the subject, %h refers to the abbreviated commit hash, so the output format will be set to: `subject abbreviated git commit hash`.

#### Setting output range

After the git log command followed by `"$previous_tag".."$current_tag"` will output commit records from the git commit tag represented by the `previous_tag` variable (excluding) to `current_tag`.

### git rev-parse
This low-level command is mainly used to resolve git references to hash values.

#### --abbrev-ref HEAD
The --abbrev-ref modifier makes rev-parse output the abbreviated name of the resolved reference. HEAD usually points to the current branch.

The final output is the abbreviated name of the current branch.

### git fetch
Fetch the latest commits, branches and other data from the remote repository, but do not merge or modify the current code. After running, you can use git log origin/branch-name to view the latest updates.

#### --prune
Clean up branches that exist locally but no longer exist in the remote repository during update.

### git pull
Fetch updates from the remote repository and merge them into the current branch. Equivalent to running git fetch + git merge origin/current-branch-name

### git tag
List all tags. When followed by a modifier like v1.0.0, it will create a tag.

#### --sort
Git tag sorting modifier.

For example, `--sort=-version:refname` displays tags in reverse order by version number, where `-` means reverse order, the `version:` prefix makes git understand the tag name as a version number rather than a regular string, and `refname` refers to the tag name itself.

## Computer Basics

### Binary
1 byte = 8 bits. Bit is the smallest unit of binary. UTF-8 encoding converts a Unicode character into several 8-bit bytes.

### Hexadecimal
1 hexadecimal digit = 4 binary digits. Two hexadecimal digits can represent one byte (8 bits).

Hexadecimal representation in js includes:
- 0x. Standard representation of hexadecimal values
- %. URL encoding.
- \x. Represents a byte. (latin1 range, 0-255)
- \u. Represents a Unicode code unit. (two bytes)

### UTF-16
In UTF-16 encoding, the minimum data unit is fixed at 16 bits. Some Unicode characters require 2 code units to be fully represented.

JS engines internally always use UTF-16 to store all strings. Strings consist of a series of 16-bit code units.

## Binary in JavaScript

### << Operator
`<<` Left shift operator, shifts a number left by the specified number of bits. After left shifting, zeros are padded on the right, which is equivalent to multiplying the value by 2 to the power of the number of shifted bits.

### >>> Operator
`>>>` Unsigned right shift operator.

### Mask
`|` The operator compares each bit of two numbers, and if at least one is 1, the result bit is 1, so it's convenient for assigning values to binary numbers.

`&` The result bit is 1 only when both corresponding binary bits of the two operands are 1, so it's convenient for extracting values.

For example:
```
let a = (num >>> 12) & 63
```

63 in binary is 00111111, so the value of a is the rightmost 6 binary bits of the num variable.

### Uint8Array
`Uint8Array` represents an 8-bit unsigned integer array, used to store binary data. The length of the array is the total byte length.

### btoa
`btoa` converts binary/latin1 encoded strings to base64 encoded ASCII strings.

Characters other than latin1 encoded characters will first be converted to utf-8 before encoding.

### encodeURI
`encodeURI` does not encode ASCII letters, numbers, and punctuation marks in URIs: - _ . ! ~ * ' ( ), others will be encoded.
However, for the following ASCII punctuation marks that have special meanings in URIs, the encodeURI() function will not escape them: ;/?:@&=+$,#

### encodeURIComponent
`encodeURIComponent` does not encode ASCII characters, including punctuation marks - _ . ! ~ * ' ( ), upper and lower case letters, numbers, others will be encoded.

Both methods first convert characters to utf-8 encoded single-byte sequences, and each byte can be represented by two hexadecimal characters, then add a `%` before each byte (2 hexadecimal digits).

> For example, the Chinese character "你" has Unicode U+4F60, its UTF-8 encoding is 0xE4 0xBD 0xA0 (three bytes).
> 0xE4 = binary 11100100, 1110 = E   0100 = 4, hexadecimal character: E4, then the URL encoding format is: %E4
> Each byte can be written as %E4, %BD, %A0, which is what URL encoding looks like.

### escape
Converts special characters in a string to hexadecimal representation (%/%u+xx). For characters within the range less than 255, it behaves consistently with encodeURIComponent. For characters greater than 255, it outputs %uXXX, preserving the entire four-digit hexadecimal code point.

Unencoded ASCII characters: upper and lower case letters, numbers, and punctuation marks - _ . * @ + /

ASCII characters (0-255): Converted to %XX format (XX is the hexadecimal value).

Unicode characters (> 255): Converted to %uXXXX format (XXXX is a 4-digit hexadecimal Unicode code point).

### unescape
Decodes hexadecimal characters starting with %/%u into code point bits 0xXX/0xXXXX (single-byte within latin1 range). It doesn't care whether the characters are ASCII characters that `escape` doesn't encode.

So even though escape doesn't encode `@ + /`, `@ + /` processed by encodeURIComponent will still be decoded by unescape.

### String.fromCharCode
JavaScript strings are composed of a series of 16-bit code units (values 0–65535) at the底层.

String.fromCharCode(n) creates a string containing a single code unit with value n.

### String.charCodeAt
`String.charCodeAt` returns the Unicode code point of a character.

## Shell

### $
`$` + variable name can reference variables.

### grep
`grep`, text search command

`-E` modifier indicates using regex, returns `1` when no matching text is found.

### |
`|` passes the output from the left side as input to the right side.

### ||
If the exit code of the left side of the operator is 0, execution of the right side command is skipped; otherwise, the right side command is executed.

### $()
`$()` will run the command inside the parentheses and use the output as the result to participate in subsequent command operations.

### echo
`echo`, print command, displays text or variable content to the standard output device.

`echo -e` is used to enable

#### in github actions
In github actions, `::` is a special instruction for communicating with github actions. When recognized, the text after echo will be treated as an instruction rather than ordinary text.

`::set-output name=variable-name::variable-value` can define variables for the job, which can be referenced later through `${{steps.step-id.outputs.variable-name}}`.

### true
`true` returns exit code 0.

### @
`${array[@]}` expands all elements of the array.

### set -e
Normally, shell scripts ignore non-zero exit codes during execution. With `set -e`, if a non-zero exit code appears, the script will stop executing immediately.

### Conditional judgment
`if ... ; then`, if the condition after if is true, the commands after then will be executed.

`for (variable-name) in (list-type-variable-name); do` will loop through the list and execute the loop body code. `done` marks the end of the loop, and `fi` marks the end of the if judgment.

### [[]]
`[[]]` is used for conditional judgment, for example `[["$message"]]` judges that the variable length is non-zero, which is true, and has the same effect as `[[ -n "$message" ]]`.

### \>
`>` is used to overwrite files, followed by a filename.

### cat
`cat` reads file content and outputs it to the command line.

## Node

### __dirname and process.cwd

```
- ui
  - scripts
    - test.ts
```

At this time, the code execution result in test.ts:

```typescript
process.cwd() // D:\code\ui
__dirname // D:\code\ui\scripts
```
