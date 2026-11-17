// Generated and verified: every example and solution output below was produced by running the code with CPython.
import type { Lesson } from "./lessons";

export const advancedLessons: Lesson[] = [
 {
  "id": "f-strings",
  "stage": "Levels 1–25 · Write it cleanly",
  "title": "Format output with f-strings",
  "short": "Readable, precise text",
  "goal": "Build messages with f-strings and control decimals, width, and alignment.",
  "intro": "You already join text with + and print several values. Real programs format output constantly: reports, logs, receipts. An f-string lets you write the sentence you want and drop values straight into it. After the value, a format specification controls how it looks.",
  "concepts": [
   {
    "term": "f\"...{name}...\"",
    "meaning": "Put f before the opening quote. Anything inside { } is evaluated as Python and inserted as text."
   },
   {
    "term": "{value:.2f}",
    "meaning": "After a colon, a format spec. .2f means a float with exactly two decimal places. , adds thousands separators."
   },
   {
    "term": "{text:<10}",
    "meaning": "< left-aligns, > right-aligns, ^ centres inside a width. Use it to build neat columns."
   }
  ],
  "code": "item = \"notebook\"\nprice = 3.5\nqty = 4\nprint(f\"{qty} x {item} costs ${price * qty:.2f}\")\nprint(f\"{'Item':<10}|{'Total':>8}\")\nprint(f\"{item:<10}|{price * qty:>8.2f}\")\nprint(f\"{1234567:,}\")",
  "output": "4 x notebook costs $14.00\nItem      |   Total\nnotebook  |   14.00\n1,234,567",
  "lines": [
   {
    "line": 4,
    "explanation": "Python evaluates price * qty inside the braces, then formats 14.0 as 14.00."
   },
   {
    "line": 5,
    "explanation": "Header row: 'Item' padded on the right to 10 characters, 'Total' padded on the left to 8."
   },
   {
    "line": 6,
    "explanation": "The same widths make the data line up under the headers. >8.2f combines alignment, width, and decimals."
   },
   {
    "line": 7,
    "explanation": "The , spec inserts thousands separators."
   }
  ],
  "tryIt": "Add a variable discount = 0.1 and print a final line that shows the discounted total with two decimals, e.g. After discount: $12.60.",
  "hint": "Compute inside the braces: {price * qty * (1 - discount):.2f}.",
  "solution": "item = \"notebook\"\nprice = 3.5\nqty = 4\ndiscount = 0.1\nprint(f\"{qty} x {item} costs ${price * qty:.2f}\")\nprint(f\"After discount: ${price * qty * (1 - discount):.2f}\")",
  "solutionOutput": "4 x notebook costs $14.00\nAfter discount: $12.60",
  "pitfall": "Forgetting the f prefix prints the braces literally: \"{item}\". Also, inside an f-string with double quotes, use single quotes for string literals within the braces.",
  "check": {
   "question": "What does f\"{2/3:.3f}\" produce?",
   "choices": [
    "0.666",
    "0.667",
    "2/3"
   ],
   "answer": 1,
   "why": ".3f rounds to three decimal places, so 0.6666… becomes 0.667."
  }
 },
 {
  "id": "slicing",
  "stage": "Levels 1–25 · Write it cleanly",
  "title": "Slice sequences",
  "short": "Take exactly the part you need",
  "goal": "Use indexes, negative indexes, and slices on strings and lists.",
  "intro": "Strings and lists are sequences: ordered collections you can index by position. A slice takes a range of positions in one expression. Slicing never changes the original; it produces a new string or list. Once slicing feels natural, a lot of loops disappear.",
  "concepts": [
   {
    "term": "seq[-1]",
    "meaning": "Negative indexes count from the end. -1 is the last item, -2 the one before it."
   },
   {
    "term": "seq[start:stop]",
    "meaning": "Takes items from start up to, but not including, stop. Leave either side empty to mean 'from the beginning' or 'to the end'."
   },
   {
    "term": "seq[::step]",
    "meaning": "A third number sets the step. [::2] takes every other item; [::-1] walks backwards, reversing the sequence."
   }
  ],
  "code": "word = \"PYTHONIC\"\nprint(word[0], word[-1])\nprint(word[0:6])\nprint(word[-3:])\nprint(word[::-1])\nscores = [72, 88, 95, 61, 79]\nprint(scores[1:4])\nprint(scores[::2])",
  "output": "P C\nPYTHON\nNIC\nCINOHTYP\n[88, 95, 61]\n[72, 95, 79]",
  "lines": [
   {
    "line": 2,
    "explanation": "The first character is at index 0; the last is at index -1."
   },
   {
    "line": 3,
    "explanation": "Positions 0 to 5. Position 6 is the stop and is excluded."
   },
   {
    "line": 4,
    "explanation": "Start three from the end and run to the end."
   },
   {
    "line": 5,
    "explanation": "A step of -1 reverses the string."
   },
   {
    "line": 7,
    "explanation": "Slices work the same way on lists: items at positions 1, 2 and 3."
   },
   {
    "line": 8,
    "explanation": "Every second score, starting at position 0."
   }
  ],
  "tryIt": "Using slices only, print the middle three scores and then the scores in reverse order.",
  "hint": "With five scores, the middle three are positions 1, 2 and 3. Reverse with a step of -1.",
  "solution": "scores = [72, 88, 95, 61, 79]\nprint(scores[1:-1])\nprint(scores[::-1])",
  "solutionOutput": "[88, 95, 61]\n[79, 61, 95, 88, 72]",
  "pitfall": "Indexing past the end raises IndexError, but slicing past the end does not: [1, 2][5:9] quietly returns []. That's convenient, but it can also hide a wrong number.",
  "check": {
   "question": "What is \"ABCDE\"[1:3]?",
   "choices": [
    "\"BC\"",
    "\"BCD\"",
    "\"ABC\""
   ],
   "answer": 0,
   "why": "Start at index 1 (B) and stop before index 3, so only B and C."
  }
 },
 {
  "id": "unpacking",
  "stage": "Levels 1–25 · Write it cleanly",
  "title": "Tuples, unpacking, enumerate, zip",
  "short": "Work with items together",
  "goal": "Unpack values into names and loop over positions or parallel lists cleanly.",
  "intro": "A tuple is a fixed-size sequence written with commas, like (3, 4). Python lets you unpack a sequence into several names in one assignment. Two built-ins make loops cleaner: enumerate gives you each item's position, and zip walks several sequences side by side.",
  "concepts": [
   {
    "term": "a, b = pair",
    "meaning": "Unpacking: the first value goes to a, the second to b. The counts must match."
   },
   {
    "term": "enumerate(items, start=1)",
    "meaning": "Produces (position, item) pairs, so you don't need a separate counter variable."
   },
   {
    "term": "zip(a, b)",
    "meaning": "Pairs up items from two sequences: first with first, second with second. It stops at the shorter one."
   }
  ],
  "code": "point = (3, 4)\nx, y = point\nprint(x + y)\na, b = 1, 2\na, b = b, a\nprint(a, b)\nnames = [\"Ana\", \"Ben\", \"Cy\"]\nfor rank, name in enumerate(names, start=1):\n    print(rank, name)\nmarks = [91, 78, 85]\nfor name, mark in zip(names, marks):\n    print(f\"{name}: {mark}\")\nfirst, *rest = marks\nprint(first, rest)",
  "output": "7\n2 1\n1 Ana\n2 Ben\n3 Cy\nAna: 91\nBen: 78\nCy: 85\n91 [78, 85]",
  "lines": [
   {
    "line": 2,
    "explanation": "The tuple's two values are unpacked into x and y."
   },
   {
    "line": 5,
    "explanation": "Swap two variables in one step. The right side is built first, then unpacked."
   },
   {
    "line": 8,
    "explanation": "Each loop step unpacks a (position, name) pair. start=1 makes the count human-friendly."
   },
   {
    "line": 11,
    "explanation": "zip pairs each name with the mark at the same position."
   },
   {
    "line": 13,
    "explanation": "A starred name collects everything left over into a list."
   }
  ],
  "tryIt": "Print each student on one line as 1. Ana (91), combining enumerate and zip.",
  "hint": "Wrap zip inside enumerate and unpack nested parentheses: for i, (name, mark) in enumerate(zip(names, marks), start=1).",
  "solution": "names = [\"Ana\", \"Ben\", \"Cy\"]\nmarks = [91, 78, 85]\nfor i, (name, mark) in enumerate(zip(names, marks), start=1):\n    print(f\"{i}. {name} ({mark})\")",
  "solutionOutput": "1. Ana (91)\n2. Ben (78)\n3. Cy (85)",
  "pitfall": "A one-item tuple needs a trailing comma: (5,) is a tuple, but (5) is just the number 5 in parentheses.",
  "check": {
   "question": "After a, b = 1, 2 and then a, b = b, a, what is a?",
   "choices": [
    "1",
    "2",
    "(1, 2)"
   ],
   "answer": 1,
   "why": "The right side (2, 1) is built first, then unpacked, so a becomes 2."
  }
 },
 {
  "id": "sets-dicts",
  "stage": "Levels 1–25 · Write it cleanly",
  "title": "Sets and dictionary patterns",
  "short": "Fast lookups and counting",
  "goal": "Use sets for uniqueness and membership, and dictionaries for counting and grouping.",
  "intro": "A set stores unique values with no order and answers 'is this in here?' very fast. Sets also support maths-like operations such as union and intersection. Dictionaries map keys to values; two methods, get and setdefault, cover most counting and grouping work.",
  "concepts": [
   {
    "term": "{1, 2, 3}",
    "meaning": "A set literal. Duplicates are dropped automatically. Use set() for an empty set, because {} is an empty dict."
   },
   {
    "term": "a & b, a | b, a - b",
    "meaning": "Intersection (in both), union (in either), and difference (in a but not b)."
   },
   {
    "term": "d.get(k, 0)",
    "meaning": "Returns d[k] if the key exists, otherwise the default. Perfect for counting without KeyError."
   }
  ],
  "code": "tags = [\"python\", \"data\", \"python\", \"web\", \"data\"]\nunique = set(tags)\nprint(sorted(unique))\nprint(\"web\" in unique)\nmine = {\"python\", \"data\"}\nyours = {\"data\", \"web\"}\nprint(sorted(mine & yours), sorted(mine | yours))\ncounts = {}\nfor tag in tags:\n    counts[tag] = counts.get(tag, 0) + 1\nprint(counts)\nby_letter = {}\nfor tag in tags:\n    by_letter.setdefault(tag[0], []).append(tag)\nprint(by_letter)",
  "output": "['data', 'python', 'web']\nTrue\n['data'] ['data', 'python', 'web']\n{'python': 2, 'data': 2, 'web': 1}\n{'p': ['python', 'python'], 'd': ['data', 'data'], 'w': ['web']}",
  "lines": [
   {
    "line": 2,
    "explanation": "Converting to a set removes the duplicate tags."
   },
   {
    "line": 3,
    "explanation": "Sets have no order, so sort them before printing if you need a stable result."
   },
   {
    "line": 7,
    "explanation": "Only data is in both sets; the union has all three tags."
   },
   {
    "line": 10,
    "explanation": "get returns 0 the first time a tag appears, so every tag starts counting from zero."
   },
   {
    "line": 14,
    "explanation": "setdefault creates an empty list for a new letter, then returns that list so append works."
   }
  ],
  "tryIt": "Find the tags that appear more than once and print them as a sorted list.",
  "hint": "After counting, loop over counts.items() and keep the tags whose count is greater than 1.",
  "solution": "tags = [\"python\", \"data\", \"python\", \"web\", \"data\"]\ncounts = {}\nfor tag in tags:\n    counts[tag] = counts.get(tag, 0) + 1\nrepeated = []\nfor tag, n in counts.items():\n    if n > 1:\n        repeated.append(tag)\nprint(sorted(repeated))",
  "solutionOutput": "['data', 'python']",
  "pitfall": "Printing a set of strings can show a different order on each run. Sort it when order matters. Also, sets and dict keys only accept hashable values: a list can't go inside a set.",
  "check": {
   "question": "What does len({1, 1, 2, 2, 3}) return?",
   "choices": [
    "5",
    "3",
    "2"
   ],
   "answer": 1,
   "why": "A set keeps only unique values: 1, 2 and 3."
  }
 },
 {
  "id": "comprehensions",
  "stage": "Levels 1–25 · Write it cleanly",
  "title": "Comprehensions",
  "short": "Build collections in one line",
  "goal": "Write list, dict, and set comprehensions with optional filters.",
  "intro": "Many loops follow the same pattern: start with an empty list, loop, maybe test something, append a result. A comprehension writes that pattern as a single expression. Read it left to right as 'this value, for each item, if a condition holds'.",
  "concepts": [
   {
    "term": "[expr for x in items]",
    "meaning": "A list comprehension. Builds a new list containing expr for each x."
   },
   {
    "term": "... if condition",
    "meaning": "An optional filter at the end keeps only the items where the condition is true."
   },
   {
    "term": "{k: v for ...}",
    "meaning": "Curly braces with key: value make a dict comprehension; with a single value, a set comprehension."
   }
  ],
  "code": "nums = [1, 2, 3, 4, 5, 6]\nsquares = [n * n for n in nums]\nprint(squares)\nevens = [n for n in nums if n % 2 == 0]\nprint(evens)\nwords = [\"apple\", \"kiwi\", \"banana\"]\nlengths = {w: len(w) for w in words}\nprint(lengths)\nlabels = [\"even\" if n % 2 == 0 else \"odd\" for n in nums[:3]]\nprint(labels)",
  "output": "[1, 4, 9, 16, 25, 36]\n[2, 4, 6]\n{'apple': 5, 'kiwi': 4, 'banana': 6}\n['odd', 'even', 'odd']",
  "lines": [
   {
    "line": 2,
    "explanation": "For each n, compute n * n and collect the results."
   },
   {
    "line": 4,
    "explanation": "The trailing if keeps only even numbers. Nothing is transformed here."
   },
   {
    "line": 7,
    "explanation": "A dict comprehension maps each word to its length."
   },
   {
    "line": 9,
    "explanation": "An if/else at the front chooses the value; it is not a filter. Every item produces a label."
   }
  ],
  "tryIt": "From words, build a list of the words longer than four letters, in upper case.",
  "hint": "Put the transformation (w.upper()) at the front and the filter (len(w) > 4) at the end.",
  "solution": "words = [\"apple\", \"kiwi\", \"banana\"]\nprint([w.upper() for w in words if len(w) > 4])",
  "solutionOutput": "['APPLE', 'BANANA']",
  "pitfall": "Don't use a comprehension only for side effects, such as [print(x) for x in items]. It builds a throwaway list; a plain for loop is clearer. If a comprehension needs several conditions and nested loops, a loop is usually easier to read.",
  "check": {
   "question": "What is [x * 2 for x in range(4) if x > 1]?",
   "choices": [
    "[4, 6]",
    "[0, 2, 4, 6]",
    "[2, 3]"
   ],
   "answer": 0,
   "why": "range(4) gives 0 to 3; only 2 and 3 pass the filter, and each is doubled."
  }
 },
 {
  "id": "arguments",
  "stage": "Levels 26–50 · Functions that scale",
  "title": "Flexible function arguments",
  "short": "Defaults, keywords, *args, **kwargs",
  "goal": "Design functions with default values, keyword arguments, and variable numbers of arguments.",
  "intro": "Functions become more useful when callers can skip optional details or name what they are passing. Python lets you give parameters defaults, pass arguments by name, and accept any number of extra values. You'll see *args and **kwargs throughout library code.",
  "concepts": [
   {
    "term": "def f(x, sep=\", \")",
    "meaning": "A default value makes a parameter optional. Parameters with defaults come after those without."
   },
   {
    "term": "f(x, sep=\"-\")",
    "meaning": "A keyword argument names the parameter, so order doesn't matter and the call explains itself."
   },
   {
    "term": "*args, **kwargs",
    "meaning": "*args collects extra positional values into a tuple; **kwargs collects extra keyword values into a dict."
   }
  ],
  "code": "def greet(name, greeting=\"Hello\", punct=\"!\"):\n    return f\"{greeting}, {name}{punct}\"\nprint(greet(\"Ana\"))\nprint(greet(\"Ben\", punct=\"?\"))\ndef total(*prices, tax=0.0):\n    return round(sum(prices) * (1 + tax), 2)\nprint(total(2, 3, 5))\nprint(total(2, 3, 5, tax=0.1))\ndef describe(**info):\n    for key, value in info.items():\n        print(f\"{key} = {value}\")\ndescribe(lang=\"Python\", year=1991)",
  "output": "Hello, Ana!\nHello, Ben?\n10.0\n11.0\nlang = Python\nyear = 1991",
  "lines": [
   {
    "line": 1,
    "explanation": "greeting and punct have defaults, so callers may omit them."
   },
   {
    "line": 4,
    "explanation": "Skip greeting but set punct by name."
   },
   {
    "line": 5,
    "explanation": "*prices gathers any number of positional values. tax comes after it, so it can only be passed by keyword."
   },
   {
    "line": 9,
    "explanation": "**info gathers keyword arguments into a dictionary."
   },
   {
    "line": 12,
    "explanation": "Each keyword argument becomes a key in info."
   }
  ],
  "tryIt": "Write average(*nums) that returns 0 when called with no numbers and otherwise the mean. Print average() and average(4, 8, 9).",
  "hint": "Check if not nums: return 0 first. Then return sum(nums) / len(nums).",
  "solution": "def average(*nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)\nprint(average())\nprint(average(4, 8, 9))",
  "solutionOutput": "0\n7.0",
  "pitfall": "Never use a mutable value such as [] or {} as a default. The default is created once, when the function is defined, and then shared by every call. Use None and create the list inside the function.",
  "check": {
   "question": "Inside def f(*args), what type is args?",
   "choices": [
    "list",
    "tuple",
    "dict"
   ],
   "answer": 1,
   "why": "Extra positional arguments are gathered into a tuple."
  }
 },
 {
  "id": "references",
  "stage": "Levels 26–50 · Functions that scale",
  "title": "Names, references, and mutability",
  "short": "Why a change shows up elsewhere",
  "goal": "Predict when changing one variable affects another, and copy data safely.",
  "intro": "A variable doesn't contain a value; it refers to an object. Two names can refer to the same object. With immutable objects, such as numbers, strings, and tuples, that never surprises you. With mutable ones, such as lists, dicts, and sets, a change through one name is visible through the other. This is the most common 'invisible' bug in intermediate code.",
  "concepts": [
   {
    "term": "b = a",
    "meaning": "Does not copy. Both names now refer to one object."
   },
   {
    "term": "is vs ==",
    "meaning": "== asks 'equal values?'. is asks 'the very same object?'. Use is mainly for None."
   },
   {
    "term": "copy / deepcopy",
    "meaning": "list(a) or a.copy() makes a shallow copy (new outer list, same inner items). copy.deepcopy copies all the way down."
   }
  ],
  "code": "import copy\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)\nc = a.copy()\nc.append(5)\nprint(a, c)\ngrid = [[0, 0], [0, 0]]\nshallow = grid.copy()\ndeep = copy.deepcopy(grid)\nshallow[0][0] = 9\nprint(grid, deep)\nprint(a == [1, 2, 3, 4], a is b, a is c)",
  "output": "[1, 2, 3, 4]\n[1, 2, 3, 4] [1, 2, 3, 4, 5]\n[[9, 0], [0, 0]] [[0, 0], [0, 0]]\nTrue True False",
  "lines": [
   {
    "line": 3,
    "explanation": "b refers to the same list as a. No new list is made."
   },
   {
    "line": 4,
    "explanation": "Appending through b changes the one shared list, so a shows the 4 as well."
   },
   {
    "line": 6,
    "explanation": "copy() makes a new outer list, so appending to c leaves a alone."
   },
   {
    "line": 10,
    "explanation": "A shallow copy of a nested list: the outer list is new, but it holds the same inner lists."
   },
   {
    "line": 12,
    "explanation": "Changing an inner list through shallow also changes grid. The deep copy is unaffected."
   },
   {
    "line": 14,
    "explanation": "a equals that list in value; a and b are the same object; c is a different object."
   }
  ],
  "tryIt": "Write add_item(item, bag=None) that appends item to bag and returns it, creating a new list when bag is None. Call it twice without a bag and print both results.",
  "hint": "Inside the function: if bag is None: bag = []. Each call then gets its own fresh list.",
  "solution": "def add_item(item, bag=None):\n    if bag is None:\n        bag = []\n    bag.append(item)\n    return bag\nprint(add_item(\"pen\"))\nprint(add_item(\"ink\"))",
  "solutionOutput": "['pen']\n['ink']",
  "pitfall": "[[0] * 3] * 3 looks like a 3×3 grid but contains the same inner list three times; changing one row changes all three. Build grids with a comprehension: [[0] * 3 for _ in range(3)].",
  "check": {
   "question": "x = [1]; y = x; y += [2]. What is x?",
   "choices": [
    "[1]",
    "[1, 2]",
    "An error"
   ],
   "answer": 1,
   "why": "y refers to the same list as x, and += on a list changes it in place."
  }
 },
 {
  "id": "functions-as-values",
  "stage": "Levels 26–50 · Functions that scale",
  "title": "Functions are values",
  "short": "Lambdas, key=, map and filter",
  "goal": "Pass functions to other functions, especially as sort keys.",
  "intro": "In Python a function is an object like any other: you can store it in a variable, put it in a list, or pass it to another function. sorted, min, and max take a key function that says what to compare. A lambda is a short, unnamed function for exactly these one-off cases.",
  "concepts": [
   {
    "term": "lambda x: x[1]",
    "meaning": "An anonymous function with one expression. lambda x: x[1] works like def f(x): return x[1]."
   },
   {
    "term": "sorted(items, key=...)",
    "meaning": "Sorts by the value the key function returns for each item. reverse=True sorts in descending order."
   },
   {
    "term": "map / filter",
    "meaning": "map applies a function to every item; filter keeps items where a function returns True. Both are lazy, so wrap them in list() to see the results."
   }
  ],
  "code": "people = [(\"Ana\", 31), (\"Ben\", 25), (\"Cy\", 40)]\nby_age = sorted(people, key=lambda p: p[1])\nprint(by_age)\nprint(max(people, key=lambda p: p[1])[0])\nwords = [\"Banana\", \"apple\", \"cherry\"]\nprint(sorted(words))\nprint(sorted(words, key=str.lower))\ndef shout(s):\n    return s.upper() + \"!\"\nactions = [shout, str.title, len]\nfor f in actions:\n    print(f(\"hello there\"))\nprint(list(map(len, words)), list(filter(lambda w: \"a\" in w, words)))",
  "output": "[('Ben', 25), ('Ana', 31), ('Cy', 40)]\nCy\n['Banana', 'apple', 'cherry']\n['apple', 'Banana', 'cherry']\nHELLO THERE!\nHello There\n11\n[6, 5, 6] ['Banana', 'apple']",
  "lines": [
   {
    "line": 2,
    "explanation": "The key returns each person's age, so sorting compares ages."
   },
   {
    "line": 4,
    "explanation": "max with a key finds the oldest person; [0] takes the name."
   },
   {
    "line": 6,
    "explanation": "By default uppercase letters sort before lowercase, so Banana comes first."
   },
   {
    "line": 7,
    "explanation": "Passing the function str.lower (without calling it) makes the sort case-insensitive."
   },
   {
    "line": 10,
    "explanation": "A list holding three functions. Note there are no parentheses: we store the functions, not their results."
   },
   {
    "line": 12,
    "explanation": "Call each stored function with the same argument."
   }
  ],
  "tryIt": "Sort people by age from oldest to youngest and print only the names, using a comprehension.",
  "hint": "sorted(people, key=lambda p: p[1], reverse=True), then [name for name, age in ...].",
  "solution": "people = [(\"Ana\", 31), (\"Ben\", 25), (\"Cy\", 40)]\noldest_first = sorted(people, key=lambda p: p[1], reverse=True)\nprint([name for name, age in oldest_first])",
  "solutionOutput": "['Cy', 'Ana', 'Ben']",
  "pitfall": "key=str.lower passes the function. key=str.lower() calls it immediately with no text and raises TypeError. Pass functions without parentheses.",
  "check": {
   "question": "What does sorted([\"bb\", \"a\", \"ccc\"], key=len) return?",
   "choices": [
    "['a', 'bb', 'ccc']",
    "['ccc', 'bb', 'a']",
    "['a', 'ccc', 'bb']"
   ],
   "answer": 0,
   "why": "The key is each string's length, so the strings are ordered 1, 2, 3."
  }
 },
 {
  "id": "decorators",
  "stage": "Levels 26–50 · Functions that scale",
  "title": "Closures and decorators",
  "short": "Functions that wrap functions",
  "goal": "Understand closures and write a decorator that adds behaviour to any function.",
  "intro": "A function defined inside another function can remember variables from the outer one, even after the outer function has finished. That remembered environment is a closure. A decorator uses closures to wrap a function with extra behaviour, such as timing, logging, caching, or checking, without editing its body. The @name line above a def is shorthand for func = name(func).",
  "concepts": [
   {
    "term": "Closure",
    "meaning": "An inner function that keeps access to variables from the scope where it was created."
   },
   {
    "term": "@decorator",
    "meaning": "@log above def add is the same as writing add = log(add) after the definition."
   },
   {
    "term": "functools.wraps",
    "meaning": "Copies the original function's name and docstring onto the wrapper, so tools and error messages still show the real name."
   }
  ],
  "code": "from functools import wraps\ndef make_multiplier(n):\n    def multiply(x):\n        return x * n\n    return multiply\ntriple = make_multiplier(3)\nprint(triple(5))\ndef log_calls(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        print(f\"calling {func.__name__}{args}\")\n        result = func(*args, **kwargs)\n        print(f\"{func.__name__} returned {result}\")\n        return result\n    return wrapper\n@log_calls\ndef add(a, b):\n    return a + b\nadd(2, 3)\nprint(add.__name__)",
  "output": "15\ncalling add(2, 3)\nadd returned 5\nadd",
  "lines": [
   {
    "line": 3,
    "explanation": "multiply uses n, which belongs to the outer function."
   },
   {
    "line": 6,
    "explanation": "make_multiplier has returned, but triple still remembers n = 3. That's a closure."
   },
   {
    "line": 10,
    "explanation": "The wrapper accepts any arguments so it can wrap any function."
   },
   {
    "line": 12,
    "explanation": "Call the original function, keep its result, and return it unchanged."
   },
   {
    "line": 16,
    "explanation": "Equivalent to writing add = log_calls(add) after the def."
   },
   {
    "line": 20,
    "explanation": "Thanks to @wraps, the wrapped function still reports its original name."
   }
  ],
  "tryIt": "Write a decorator count_calls that counts how many times a function is called and prints the count on each call. Decorate a greet(name) function and call it twice.",
  "hint": "Store the count on the wrapper itself: wrapper.calls = 0 before returning it, then wrapper.calls += 1 inside.",
  "solution": "from functools import wraps\ndef count_calls(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        print(f\"call #{wrapper.calls}\")\n        return func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n@count_calls\ndef greet(name):\n    print(f\"Hi {name}\")\ngreet(\"Ana\")\ngreet(\"Ben\")",
  "solutionOutput": "call #1\nHi Ana\ncall #2\nHi Ben",
  "pitfall": "Forgetting return result inside the wrapper silently turns every decorated function into one that returns None. Also, closures created in a loop capture the variable, not its value at that moment.",
  "check": {
   "question": "@timer above def run(): ... is equivalent to which line?",
   "choices": [
    "run = timer(run)",
    "timer = run(timer)",
    "run = timer()"
   ],
   "answer": 0,
   "why": "The decorator receives the function and its return value replaces the original name."
  }
 },
 {
  "id": "exceptions",
  "stage": "Levels 26–50 · Functions that scale",
  "title": "Handle and raise errors",
  "short": "try, except, else, finally, raise",
  "goal": "Catch specific exceptions, raise your own, and clean up reliably.",
  "intro": "Errors are normal events, not only bugs: a file is missing, a user types 'ten', a network call fails. Python signals these with exceptions. Good code catches the specific exceptions it can handle, lets the others surface, and raises clear exceptions of its own when inputs are invalid.",
  "concepts": [
   {
    "term": "try / except Type",
    "meaning": "Run code that may fail; if that exception type is raised, run the handler instead of crashing."
   },
   {
    "term": "else / finally",
    "meaning": "else runs only if no exception occurred. finally always runs, which makes it the place for cleanup."
   },
   {
    "term": "raise / custom class",
    "meaning": "raise ValueError(\"...\") signals a problem. Subclass Exception to create your own error types."
   }
  ],
  "code": "class InsufficientFunds(Exception):\n    pass\ndef withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError(\"amount must be positive\")\n    if amount > balance:\n        raise InsufficientFunds(f\"need {amount - balance} more\")\n    return balance - amount\nfor amount in [30, -5, 500]:\n    try:\n        left = withdraw(100, amount)\n    except ValueError as err:\n        print(\"Bad input:\", err)\n    except InsufficientFunds as err:\n        print(\"Declined:\", err)\n    else:\n        print(\"OK, left:\", left)\n    finally:\n        print(\"-- checked\", amount)",
  "output": "OK, left: 70\n-- checked 30\nBad input: amount must be positive\n-- checked -5\nDeclined: need 400 more\n-- checked 500",
  "lines": [
   {
    "line": 1,
    "explanation": "A custom exception. Inheriting from Exception is enough to make a new, catchable error type."
   },
   {
    "line": 5,
    "explanation": "Reject impossible input loudly instead of returning a strange value."
   },
   {
    "line": 11,
    "explanation": "Only this call is inside try, so unrelated mistakes aren't accidentally caught."
   },
   {
    "line": 12,
    "explanation": "as err gives you the exception object; printing it shows its message."
   },
   {
    "line": 16,
    "explanation": "else runs only when withdraw succeeded."
   },
   {
    "line": 18,
    "explanation": "finally runs every time, whether or not there was an error."
   }
  ],
  "tryIt": "Write to_int(text) that returns int(text), or returns None and prints a warning when the text isn't a whole number. Try it on \"42\" and \"forty\".",
  "hint": "Wrap return int(text) in try and catch ValueError specifically.",
  "solution": "def to_int(text):\n    try:\n        return int(text)\n    except ValueError:\n        print(f\"warning: {text!r} is not a whole number\")\n        return None\nprint(to_int(\"42\"))\nprint(to_int(\"forty\"))",
  "solutionOutput": "42\nwarning: 'forty' is not a whole number\nNone",
  "pitfall": "A bare except: or except Exception: around a large block hides real bugs, such as typos that raise NameError. Catch the narrowest type, keep the try block small, and let unexpected errors surface.",
  "check": {
   "question": "When does a finally block run?",
   "choices": [
    "Only after an exception",
    "Only when no exception occurs",
    "Always, after try (and any except/else)"
   ],
   "answer": 2,
   "why": "finally runs on every path. That's why it is used for cleanup."
  }
 },
 {
  "id": "classes",
  "stage": "Levels 51–75 · Model with objects",
  "title": "Classes and objects",
  "short": "Bundle data with behaviour",
  "goal": "Define a class with an __init__ method, attributes, and methods, and create instances.",
  "intro": "So far, data (lists and dicts) and behaviour (functions) have lived separately. A class bundles them: it is a blueprint, and each object made from it (an instance) carries its own data plus the methods that work on that data. Classes are how most larger Python programs and libraries are organised.",
  "concepts": [
   {
    "term": "class Account:",
    "meaning": "Defines a new type. By convention, class names use CapitalizedWords."
   },
   {
    "term": "__init__(self, ...)",
    "meaning": "Runs when you create an instance. self is the new object, so self.owner = owner stores data on it."
   },
   {
    "term": "Methods",
    "meaning": "Functions defined inside the class. Python passes the instance as self automatically: acct.deposit(5) calls Account.deposit(acct, 5)."
   }
  ],
  "code": "class Account:\n    interest_rate = 0.02\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n        return self.balance\n    def add_interest(self):\n        self.balance += self.balance * self.interest_rate\na = Account(\"Ana\", 100)\nb = Account(\"Ben\")\na.deposit(50)\na.add_interest()\nprint(a.owner, a.balance)\nprint(b.owner, b.balance)\nprint(Account.interest_rate, isinstance(a, Account))",
  "output": "Ana 153.0\nBen 0\n0.02 True",
  "lines": [
   {
    "line": 2,
    "explanation": "A class attribute is shared by every instance."
   },
   {
    "line": 4,
    "explanation": "Instance attributes: each account gets its own owner and balance."
   },
   {
    "line": 7,
    "explanation": "Methods change the instance through self."
   },
   {
    "line": 11,
    "explanation": "Calling the class creates an instance and runs __init__ with these arguments."
   },
   {
    "line": 13,
    "explanation": "deposit changes only a's balance; b is a separate object."
   },
   {
    "line": 17,
    "explanation": "isinstance checks whether an object was made from a class."
   }
  ],
  "tryIt": "Add a withdraw(amount) method that raises ValueError if the amount is larger than the balance. Withdraw 30 from a new Account(\"Cy\", 50) and print the balance.",
  "hint": "Inside withdraw: if amount > self.balance: raise ValueError(\"insufficient funds\"). Otherwise subtract it.",
  "solution": "class Account:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError(\"insufficient funds\")\n        self.balance -= amount\nc = Account(\"Cy\", 50)\nc.withdraw(30)\nprint(c.balance)",
  "solutionOutput": "20",
  "pitfall": "Forgetting self as the first parameter gives \"takes 1 positional argument but 2 were given\". And writing balance = 0 instead of self.balance = 0 creates a local variable that disappears when the method ends.",
  "check": {
   "question": "In acct.deposit(10), what is self?",
   "choices": [
    "The class Account",
    "The object acct",
    "The number 10"
   ],
   "answer": 1,
   "why": "Python passes the instance the method was called on as the first argument."
  }
 },
 {
  "id": "dunder-methods",
  "stage": "Levels 51–75 · Model with objects",
  "title": "Make objects feel built-in",
  "short": "__repr__, __eq__, __len__ and friends",
  "goal": "Implement special methods so your objects print, compare, and work with operators.",
  "intro": "Why does len() work on lists, + on numbers, and == on strings? Each of those calls a special method, named with double underscores (\"dunder\"). If you define the same methods on your class, your objects work with Python's built-in syntax too. This is what the Python data model means.",
  "concepts": [
   {
    "term": "__repr__",
    "meaning": "Returns an unambiguous text form for developers. print, the REPL, and debugging all use it. Define it on every class."
   },
   {
    "term": "__eq__ / __lt__",
    "meaning": "Define what == and < mean for your objects. Without __eq__, == checks whether two names refer to the same object."
   },
   {
    "term": "__add__, __len__, __iter__",
    "meaning": "Hook into +, len(), and for loops. Return NotImplemented for types you don't support."
   }
  ],
  "code": "class Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __repr__(self):\n        return f\"Vector({self.x}, {self.y})\"\n    def __eq__(self, other):\n        return (self.x, self.y) == (other.x, other.y)\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n    def __mul__(self, k):\n        return Vector(self.x * k, self.y * k)\n    def __abs__(self):\n        return (self.x ** 2 + self.y ** 2) ** 0.5\nv = Vector(3, 4)\nw = Vector(1, 1)\nprint(v + w, v * 2)\nprint(abs(v), v == Vector(3, 4))\nprint([v, w])",
  "output": "Vector(4, 5) Vector(6, 8)\n5.0 True\n[Vector(3, 4), Vector(1, 1)]",
  "lines": [
   {
    "line": 4,
    "explanation": "Without __repr__ you'd see something like <__main__.Vector object at 0x…>."
   },
   {
    "line": 6,
    "explanation": "Two vectors are equal when their coordinates are equal."
   },
   {
    "line": 8,
    "explanation": "v + w calls v.__add__(w) and returns a new Vector."
   },
   {
    "line": 12,
    "explanation": "abs(v) calls v.__abs__(): here, the vector's length."
   },
   {
    "line": 18,
    "explanation": "Lists display their items using __repr__ too."
   }
  ],
  "tryIt": "Add __len__ returning 2 and __iter__ that yields x then y, so len(v) works and x, y = v unpacks. Print both.",
  "hint": "def __iter__(self): yield self.x; yield self.y (on separate lines). Unpacking uses iteration.",
  "solution": "class Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __len__(self):\n        return 2\n    def __iter__(self):\n        yield self.x\n        yield self.y\nv = Vector(3, 4)\nx, y = v\nprint(len(v), x, y)",
  "solutionOutput": "2 3 4",
  "pitfall": "If you define __eq__, Python sets __hash__ to None, so your objects can no longer go into sets or be dict keys. Define __hash__ as well, or use a frozen dataclass (coming up in two lessons).",
  "check": {
   "question": "What does a + b call when a is your object?",
   "choices": [
    "a.__add__(b)",
    "b.__add__(a)",
    "add(a, b)"
   ],
   "answer": 0,
   "why": "The left operand's __add__ is tried first. Python tries b.__radd__(a) only if that returns NotImplemented."
  }
 },
 {
  "id": "inheritance",
  "stage": "Levels 51–75 · Model with objects",
  "title": "Inheritance and composition",
  "short": "Reuse behaviour without copy-paste",
  "goal": "Extend a class with a subclass, call super(), and know when composition is better.",
  "intro": "A subclass inherits everything from its parent and can override or extend any of it. That lets different classes share one interface, such as speak(), while behaving differently. This is polymorphism. Inheritance models 'is a' relationships. When one object simply uses another ('has a'), store it as an attribute instead. That's composition, and it is often the simpler choice.",
  "concepts": [
   {
    "term": "class Dog(Animal):",
    "meaning": "Dog inherits Animal's attributes and methods. Anything Dog defines with the same name overrides the parent version."
   },
   {
    "term": "super().__init__(...)",
    "meaning": "Calls the parent's version of a method, so a subclass extends behaviour instead of replacing it."
   },
   {
    "term": "Composition",
    "meaning": "A Car has an Engine: store self.engine = Engine(). Prefer this over deep inheritance trees."
   }
  ],
  "code": "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return \"...\"\n    def intro(self):\n        return f\"{self.name} says {self.speak()}\"\nclass Dog(Animal):\n    def speak(self):\n        return \"Woof\"\nclass Puppy(Dog):\n    def __init__(self, name, age_weeks):\n        super().__init__(name)\n        self.age_weeks = age_weeks\n    def speak(self):\n        return super().speak().lower() + \"!\"\npets = [Animal(\"Generic\"), Dog(\"Rex\"), Puppy(\"Bit\", 9)]\nfor pet in pets:\n    print(pet.intro())\nprint(isinstance(pets[2], Animal), Puppy.__mro__[1].__name__)",
  "output": "Generic says ...\nRex says Woof\nBit says woof!\nTrue Dog",
  "lines": [
   {
    "line": 7,
    "explanation": "intro calls self.speak(), so whichever subclass the object belongs to decides what is said."
   },
   {
    "line": 9,
    "explanation": "Dog overrides speak. It inherits __init__ and intro unchanged."
   },
   {
    "line": 13,
    "explanation": "super().__init__ lets Animal set name; Puppy then adds its own attribute."
   },
   {
    "line": 16,
    "explanation": "Extend rather than replace: take Dog's answer and modify it."
   },
   {
    "line": 19,
    "explanation": "One loop, three behaviours. That's polymorphism."
   },
   {
    "line": 20,
    "explanation": "A Puppy is also an Animal. The MRO (method resolution order) lists where Python looks for methods: Puppy, then Dog, then Animal."
   }
  ],
  "tryIt": "Add a Cat subclass whose speak returns \"Meow\", and add Cat(\"Tom\") to the loop. Print only Cat's intro.",
  "hint": "Just like Dog: subclass Animal and override speak.",
  "solution": "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return \"...\"\n    def intro(self):\n        return f\"{self.name} says {self.speak()}\"\nclass Cat(Animal):\n    def speak(self):\n        return \"Meow\"\nprint(Cat(\"Tom\").intro())",
  "solutionOutput": "Tom says Meow",
  "pitfall": "If a subclass defines __init__ but forgets super().__init__(...), the parent's attributes are never set. You'll get AttributeError later, far from the real mistake.",
  "check": {
   "question": "Which relationship suggests composition rather than inheritance?",
   "choices": [
    "A Square is a Shape",
    "A Car has an Engine",
    "A Puppy is a Dog"
   ],
   "answer": 1,
   "why": "'Has a' is composition: the Car stores an Engine as an attribute."
  }
 },
 {
  "id": "dataclasses",
  "stage": "Levels 51–75 · Model with objects",
  "title": "Dataclasses",
  "short": "Classes for data, without boilerplate",
  "goal": "Use @dataclass to get __init__, __repr__ and __eq__ for free, with defaults and ordering.",
  "intro": "Many classes mostly hold data. Writing their __init__, __repr__ and __eq__ by hand is repetitive and easy to get wrong. The @dataclass decorator reads the type-annotated fields you declare and generates those methods for you. Options such as order=True and frozen=True add comparisons and immutability.",
  "concepts": [
   {
    "term": "@dataclass",
    "meaning": "Declare fields as name: type. You get an __init__ that takes them in order, a readable __repr__, and value-based ==."
   },
   {
    "term": "field(default_factory=list)",
    "meaning": "For mutable defaults. Each instance gets its own new list instead of one shared list."
   },
   {
    "term": "frozen=True, order=True",
    "meaning": "frozen makes instances read-only and hashable. order adds < and > by comparing fields in order."
   }
  ],
  "code": "from dataclasses import dataclass, field\n@dataclass(order=True)\nclass Task:\n    priority: int\n    title: str\n    tags: list[str] = field(default_factory=list)\n    done: bool = False\na = Task(2, \"Write tests\")\nb = Task(1, \"Fix bug\", [\"urgent\"])\nprint(a)\nprint(sorted([a, b])[0].title)\na.done = True\nprint(a == Task(2, \"Write tests\", done=True))\n@dataclass(frozen=True)\nclass Point:\n    x: float\n    y: float\nprint({Point(1, 2), Point(1, 2)})",
  "output": "Task(priority=2, title='Write tests', tags=[], done=False)\nFix bug\nTrue\n{Point(x=1, y=2)}",
  "lines": [
   {
    "line": 2,
    "explanation": "order=True compares tasks field by field, starting with priority."
   },
   {
    "line": 6,
    "explanation": "default_factory=list gives every Task its own empty list."
   },
   {
    "line": 10,
    "explanation": "The generated __repr__ shows every field."
   },
   {
    "line": 11,
    "explanation": "Sorting uses the generated comparison, so the lowest priority comes first."
   },
   {
    "line": 13,
    "explanation": "The generated __eq__ compares field values."
   },
   {
    "line": 18,
    "explanation": "Frozen dataclasses are hashable, so the duplicate collapses in a set."
   }
  ],
  "tryIt": "Make a dataclass Book with title, author, and pages: int = 0, plus a method is_long() that returns True above 300 pages. Print a book and its is_long().",
  "hint": "Methods go in a dataclass body exactly as they would in a normal class.",
  "solution": "from dataclasses import dataclass\n@dataclass\nclass Book:\n    title: str\n    author: str\n    pages: int = 0\n    def is_long(self):\n        return self.pages > 300\nbook = Book(\"Dune\", \"Herbert\", 412)\nprint(book, book.is_long())",
  "solutionOutput": "Book(title='Dune', author='Herbert', pages=412) True",
  "pitfall": "Type hints in a dataclass are not checked at runtime: Task(\"high\", 5) is accepted. Validate in __post_init__ if it matters. Also, fields with defaults must come after fields without them.",
  "check": {
   "question": "Why use field(default_factory=list) instead of tags: list = []?",
   "choices": [
    "It's faster",
    "Each instance needs its own list",
    "Lists aren't allowed as fields"
   ],
   "answer": 1,
   "why": "A plain [] default would be shared by every instance. Dataclasses actually refuse it for that reason."
  }
 },
 {
  "id": "generators",
  "stage": "Levels 51–75 · Model with objects",
  "title": "Iterators and generators",
  "short": "Produce values lazily",
  "goal": "Write generator functions and expressions, and understand how for loops consume iterators.",
  "intro": "A for loop asks an object for an iterator, then repeatedly asks for the next value until it is told there are no more. A generator is the easiest way to write your own iterator: a function that uses yield. It produces one value at a time and pauses between them, so it can represent huge or even infinite sequences without storing them.",
  "concepts": [
   {
    "term": "yield",
    "meaning": "Hands one value back to the caller, then pauses the function exactly there until the next value is requested."
   },
   {
    "term": "next(it)",
    "meaning": "Asks an iterator for its next value. When it runs out, it raises StopIteration, which for loops handle for you."
   },
   {
    "term": "(x for x in ...)",
    "meaning": "A generator expression: like a list comprehension but lazy. Ideal inside sum(), any(), and max()."
   }
  ],
  "code": "def countdown(n):\n    print(\"starting\")\n    while n > 0:\n        yield n\n        n -= 1\ngen = countdown(3)\nprint(next(gen))\nprint(next(gen))\nfor value in gen:\n    print(\"loop got\", value)\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\nfrom itertools import islice\nprint(list(islice(fibonacci(), 10)))\nprint(sum(n * n for n in range(1_000_000)))",
  "output": "starting\n3\n2\nloop got 1\n[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n333332833333500000",
  "lines": [
   {
    "line": 2,
    "explanation": "This doesn't print when countdown(3) is called. The body starts only when the first value is requested."
   },
   {
    "line": 4,
    "explanation": "Give n to the caller and pause here."
   },
   {
    "line": 7,
    "explanation": "The first next() runs up to the first yield."
   },
   {
    "line": 9,
    "explanation": "The loop continues from where the generator paused and gets the one value left."
   },
   {
    "line": 13,
    "explanation": "An infinite generator is fine: it only computes values when asked."
   },
   {
    "line": 17,
    "explanation": "islice takes the first 10 values from the infinite sequence."
   },
   {
    "line": 18,
    "explanation": "A generator expression sums a million squares without building a million-item list."
   }
  ],
  "tryIt": "Write a generator evens(limit) that yields even numbers from 0 up to but not including limit. Print list(evens(10)).",
  "hint": "Loop with for n in range(limit) and yield n only when n % 2 == 0, or use range(0, limit, 2).",
  "solution": "def evens(limit):\n    for n in range(0, limit, 2):\n        yield n\nprint(list(evens(10)))",
  "solutionOutput": "[0, 2, 4, 6, 8]",
  "pitfall": "A generator can be consumed only once. After a loop finishes it, looping again produces nothing. Call the generator function again for a fresh one, or store the values with list().",
  "check": {
   "question": "What does calling a generator function return?",
   "choices": [
    "The first yielded value",
    "A list of all values",
    "A generator object that hasn't started running"
   ],
   "answer": 2,
   "why": "No code in the body runs until you call next() or loop over it."
  }
 },
 {
  "id": "context-managers",
  "stage": "Levels 76–100 · Professional Python",
  "title": "Context managers and with",
  "short": "Guaranteed setup and cleanup",
  "goal": "Use with for safe resource handling and write your own context managers.",
  "intro": "Files must be closed, locks released, and temporary settings restored, even if an error happens halfway. The with statement guarantees that. Any object with __enter__ and __exit__ methods works with it, and contextlib.contextmanager lets you write one as a simple generator.",
  "concepts": [
   {
    "term": "with open(...) as f:",
    "meaning": "__enter__ runs at the start and returns f. __exit__ runs at the end, whether the block finishes or raises."
   },
   {
    "term": "@contextmanager",
    "meaning": "Write setup code, then yield, then cleanup code inside finally. The value you yield becomes the as target."
   },
   {
    "term": "__exit__ returning True",
    "meaning": "Suppresses the exception. Rarely what you want. contextlib.suppress does it explicitly."
   }
  ],
  "code": "from contextlib import contextmanager\n@contextmanager\ndef section(name):\n    print(f\"[start {name}]\")\n    try:\n        yield name.upper()\n    finally:\n        print(f\"[end {name}]\")\nwith section(\"load\") as label:\n    print(\"working on\", label)\ntry:\n    with section(\"parse\"):\n        raise ValueError(\"bad row\")\nexcept ValueError as err:\n    print(\"caught:\", err)\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(\"line 1\\nline 2\\n\")\nprint(f.closed)\nwith open(\"notes.txt\") as f:\n    print(len(f.readlines()), \"lines\")",
  "output": "[start load]\nworking on LOAD\n[end load]\n[start parse]\n[end parse]\ncaught: bad row\nTrue\n2 lines",
  "lines": [
   {
    "line": 4,
    "explanation": "Setup: runs when the with block is entered."
   },
   {
    "line": 6,
    "explanation": "The yielded value is bound to the name after as."
   },
   {
    "line": 8,
    "explanation": "Cleanup is in finally, so it runs even when the block raises."
   },
   {
    "line": 13,
    "explanation": "The error happens inside the block, but [end parse] still prints before it propagates."
   },
   {
    "line": 18,
    "explanation": "After the with block, the file is closed automatically."
   }
  ],
  "tryIt": "Write a context manager timer_label(name) that prints \"begin <name>\" and \"done <name>\", and wrap a loop that prints the numbers 1 to 3.",
  "hint": "Follow section(): print, then try: yield, finally: print.",
  "solution": "from contextlib import contextmanager\n@contextmanager\ndef timer_label(name):\n    print(f\"begin {name}\")\n    try:\n        yield\n    finally:\n        print(f\"done {name}\")\nwith timer_label(\"count\"):\n    for i in range(1, 4):\n        print(i)",
  "solutionOutput": "begin count\n1\n2\n3\ndone count",
  "pitfall": "In a @contextmanager without try/finally, an exception inside the with block skips the cleanup code after yield. Always put cleanup in finally.",
  "check": {
   "question": "If the body of a with block raises, does __exit__ run?",
   "choices": [
    "No, the program stops immediately",
    "Yes, __exit__ always runs",
    "Only if you catch the error"
   ],
   "answer": 1,
   "why": "That guarantee is the whole point of with: cleanup happens on every path."
  }
 },
 {
  "id": "type-hints",
  "stage": "Levels 76–100 · Professional Python",
  "title": "Type hints",
  "short": "Say what goes in and comes out",
  "goal": "Annotate functions and data with types, and read hints like list[int] | None.",
  "intro": "Python doesn't check types when it runs, but hints make your intentions explicit. Editors use them for autocomplete and early warnings, and tools such as mypy and pyright check them before you run anything. In large codebases and ML libraries, hints are often the fastest documentation for what a function expects.",
  "concepts": [
   {
    "term": "def f(x: int) -> str:",
    "meaning": "Parameter and return annotations. They describe intent and are ignored at runtime."
   },
   {
    "term": "list[int], dict[str, float]",
    "meaning": "Generic types: what a container holds. X | None means 'X or None', also written Optional[X]."
   },
   {
    "term": "Protocol / TypedDict",
    "meaning": "From typing: describe 'anything with these methods' (structural typing) or the keys of a dict."
   }
  ],
  "code": "from typing import Protocol\ndef mean(values: list[float]) -> float:\n    return sum(values) / len(values)\ndef find(names: list[str], target: str) -> int | None:\n    for i, name in enumerate(names):\n        if name == target:\n            return i\n    return None\nclass HasArea(Protocol):\n    def area(self) -> float: ...\nclass Square:\n    def __init__(self, side: float) -> None:\n        self.side = side\n    def area(self) -> float:\n        return self.side ** 2\ndef total_area(shapes: list[HasArea]) -> float:\n    return sum(s.area() for s in shapes)\nprint(mean([2.0, 4.0]), find([\"a\", \"b\"], \"b\"), find([\"a\"], \"z\"))\nprint(total_area([Square(2), Square(3)]))\nprint(mean.__annotations__)\nprint(mean([1, 2, 3]))",
  "output": "3.0 1 None\n13\n{'values': list[float], 'return': <class 'float'>}\n2.0",
  "lines": [
   {
    "line": 2,
    "explanation": "values should be a list of floats; the function returns a float."
   },
   {
    "line": 4,
    "explanation": "int | None tells callers to handle the 'not found' case."
   },
   {
    "line": 9,
    "explanation": "A Protocol describes a shape: any object with an area() method fits, with no inheritance needed."
   },
   {
    "line": 19,
    "explanation": "Square never mentions HasArea, but a type checker accepts it because it has area()."
   },
   {
    "line": 20,
    "explanation": "Annotations are stored on the function and available at runtime."
   },
   {
    "line": 21,
    "explanation": "Hints aren't enforced: ints work here because the code happens to handle them."
   }
  ],
  "tryIt": "Write an annotated function word_lengths(words: list[str]) -> dict[str, int] and print its result for [\"hi\", \"there\"].",
  "hint": "A dict comprehension makes the body one line: return {w: len(w) for w in words}.",
  "solution": "def word_lengths(words: list[str]) -> dict[str, int]:\n    return {w: len(w) for w in words}\nprint(word_lengths([\"hi\", \"there\"]))",
  "solutionOutput": "{'hi': 2, 'there': 5}",
  "pitfall": "Type hints don't validate data. def f(x: int) still accepts \"7\" at runtime. Hints only help when you run a type checker (mypy, pyright) or an editor that reads them. Validate external input explicitly.",
  "check": {
   "question": "What happens when you call def f(x: int) with f(\"hello\")?",
   "choices": [
    "Python raises TypeError",
    "Python runs it anyway",
    "Python converts it to int"
   ],
   "answer": 1,
   "why": "Annotations aren't checked at runtime. Only static tools would flag this call."
  }
 },
 {
  "id": "stdlib-power",
  "stage": "Levels 76–100 · Professional Python",
  "title": "Standard library power tools",
  "short": "collections, itertools, functools",
  "goal": "Replace hand-written loops with Counter, defaultdict, itertools, and lru_cache.",
  "intro": "Python comes 'batteries included'. Before writing a helper, check whether the standard library already has it. Three modules repay learning early: collections (better containers), itertools (iterator building blocks), and functools (tools that take or return functions).",
  "concepts": [
   {
    "term": "Counter / defaultdict",
    "meaning": "Counter counts items and finds the most common. defaultdict(list) creates a missing key's value automatically."
   },
   {
    "term": "itertools",
    "meaning": "chain joins iterables; groupby groups consecutive equal keys; combinations and product enumerate choices."
   },
   {
    "term": "functools.lru_cache",
    "meaning": "Remembers a function's results for given arguments. Repeated calls become instant (memoisation)."
   }
  ],
  "code": "from collections import Counter, defaultdict, deque\nfrom itertools import chain, combinations, groupby\nfrom functools import lru_cache\nwords = \"the cat and the bird and the dog\".split()\nprint(Counter(words).most_common(2))\nby_len = defaultdict(list)\nfor w in words:\n    by_len[len(w)].append(w)\nprint(dict(by_len))\nprint(list(chain([1, 2], (3,), range(4, 6))))\nprint(list(combinations(\"ABC\", 2)))\nfor key, grp in groupby(sorted(words), key=lambda w: w[0]):\n    print(key, list(grp))\nrecent = deque(maxlen=3)\nfor n in range(6):\n    recent.append(n)\nprint(recent)\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\nprint(fib(80))",
  "output": "[('the', 3), ('and', 2)]\n{3: ['the', 'cat', 'and', 'the', 'and', 'the', 'dog'], 4: ['bird']}\n[1, 2, 3, 4, 5]\n[('A', 'B'), ('A', 'C'), ('B', 'C')]\na ['and', 'and']\nb ['bird']\nc ['cat']\nd ['dog']\nt ['the', 'the', 'the']\ndeque([3, 4, 5], maxlen=3)\n23416728348467685",
  "lines": [
   {
    "line": 5,
    "explanation": "Count every word and take the two most frequent."
   },
   {
    "line": 8,
    "explanation": "No setdefault needed: a missing key gets an empty list automatically."
   },
   {
    "line": 10,
    "explanation": "chain walks several iterables as if they were one."
   },
   {
    "line": 11,
    "explanation": "Every unordered pair of the letters A, B and C."
   },
   {
    "line": 12,
    "explanation": "groupby only groups neighbouring items, so sort by the same key first."
   },
   {
    "line": 14,
    "explanation": "A deque with maxlen keeps only the newest items, which suits a 'last N events' buffer."
   },
   {
    "line": 18,
    "explanation": "Without the cache, fib(80) would take years. With it, each n is computed once."
   }
  ],
  "tryIt": "Using Counter, print the most common letter in \"mississippi\" and how many times it appears.",
  "hint": "Counter(\"mississippi\").most_common(1) returns a list with one (letter, count) pair.",
  "solution": "from collections import Counter\nletter, count = Counter(\"mississippi\").most_common(1)[0]\nprint(letter, count)",
  "solutionOutput": "i 4",
  "pitfall": "itertools.groupby only groups consecutive items. Forgetting to sort by the same key first produces repeated, split groups.",
  "check": {
   "question": "Which tool would you use to count word frequencies?",
   "choices": [
    "collections.Counter",
    "itertools.chain",
    "functools.wraps"
   ],
   "answer": 0,
   "why": "Counter is a dict subclass built for exactly this."
  }
 },
 {
  "id": "testing",
  "stage": "Levels 76–100 · Professional Python",
  "title": "Test your code",
  "short": "assert, test functions, edge cases",
  "goal": "Write small tests that pin down behaviour, including edge cases and expected errors.",
  "intro": "A test is code that checks other code. When you change something later, tests tell you at once whether you broke it. Python's assert raises AssertionError when a condition is false. Tools such as pytest collect functions named test_* and run them. Here a tiny runner does the same, so you can see how it works.",
  "concepts": [
   {
    "term": "assert cond, msg",
    "meaning": "If cond is false, raise AssertionError with msg. Use it to state what must be true."
   },
   {
    "term": "test_* functions",
    "meaning": "One behaviour per test, with a descriptive name. pytest finds and runs them automatically."
   },
   {
    "term": "Edge cases",
    "meaning": "Empty input, one item, zero, negatives, duplicates, invalid values. Bugs cluster at the boundaries."
   }
  ],
  "code": "def median(values):\n    if not values:\n        raise ValueError(\"median of empty list\")\n    s = sorted(values)\n    mid = len(s) // 2\n    return s[mid] if len(s) % 2 else (s[mid - 1] + s[mid]) / 2\ndef test_odd_length():\n    assert median([3, 1, 2]) == 2\ndef test_even_length():\n    assert median([4, 1, 3, 2]) == 2.5\ndef test_single():\n    assert median([7]) == 7\ndef test_empty_raises():\n    try:\n        median([])\n    except ValueError:\n        return\n    raise AssertionError(\"expected ValueError\")\ntests = [test_odd_length, test_even_length, test_single, test_empty_raises]\nfor test in tests:\n    try:\n        test()\n        print(\"PASS\", test.__name__)\n    except AssertionError as err:\n        print(\"FAIL\", test.__name__, err)",
  "output": "PASS test_odd_length\nPASS test_even_length\nPASS test_single\nPASS test_empty_raises",
  "lines": [
   {
    "line": 3,
    "explanation": "Decide what invalid input should do, and test that too."
   },
   {
    "line": 8,
    "explanation": "The simplest normal case: an odd number of values."
   },
   {
    "line": 12,
    "explanation": "An edge case: one item."
   },
   {
    "line": 13,
    "explanation": "Check that the function fails in the way you designed. In pytest you would write with pytest.raises(ValueError):"
   },
   {
    "line": 20,
    "explanation": "A minimal runner. pytest does this, with much better reports."
   }
  ],
  "tryIt": "Add a test test_unsorted_input that checks median([10, 2, 38, 23, 38, 23, 21]) == 23, and add it to the tests list.",
  "hint": "Sorted, the list is 2, 10, 21, 23, 23, 38, 38. The middle one of seven is at index 3.",
  "solution": "def median(values):\n    s = sorted(values)\n    mid = len(s) // 2\n    return s[mid] if len(s) % 2 else (s[mid - 1] + s[mid]) / 2\ndef test_unsorted_input():\n    assert median([10, 2, 38, 23, 38, 23, 21]) == 23\ntest_unsorted_input()\nprint(\"PASS test_unsorted_input\")",
  "solutionOutput": "PASS test_unsorted_input",
  "pitfall": "Comparing floats with == can fail on rounding (0.1 + 0.2 != 0.3). Use math.isclose or pytest.approx. And don't use assert to validate user input in real programs: Python can be run with assertions disabled.",
  "check": {
   "question": "Which is the most useful additional test for a function that averages a list?",
   "choices": [
    "Another list of three numbers",
    "An empty list",
    "The same test twice"
   ],
   "answer": 1,
   "why": "Empty input is an edge case. It's where the division by zero would hide."
  }
 },
 {
  "id": "capstone",
  "stage": "Levels 76–100 · Professional Python",
  "title": "Capstone: a tiny library system",
  "short": "Put levels 1–99 together",
  "goal": "Combine dataclasses, exceptions, generators, comprehensions, and Counter in one small program.",
  "intro": "This program is a small library system, about the size of a real script you might write at work. Read it in full before running it. Predict each output line, then run it. Every technique in it comes from an earlier lesson. Then extend it: that's level 100.",
  "concepts": [
   {
    "term": "Design first",
    "meaning": "Data (Book) is kept separate from behaviour (Library). Errors are explicit types. Queries return generators."
   },
   {
    "term": "Small methods",
    "meaning": "Each method does one thing, which makes each one easy to test on its own."
   },
   {
    "term": "Your extension",
    "meaning": "The practice task adds a feature without breaking the existing behaviour. That's what most real programming looks like."
   }
  ],
  "code": "from collections import Counter\nfrom dataclasses import dataclass\nclass LibraryError(Exception):\n    pass\n@dataclass\nclass Book:\n    isbn: str\n    title: str\n    genre: str\n    on_loan: bool = False\nclass Library:\n    def __init__(self):\n        self.books: dict[str, Book] = {}\n    def add(self, *books: Book) -> None:\n        for b in books:\n            self.books[b.isbn] = b\n    def lend(self, isbn: str) -> Book:\n        book = self.books.get(isbn)\n        if book is None:\n            raise LibraryError(f\"unknown ISBN {isbn}\")\n        if book.on_loan:\n            raise LibraryError(f\"{book.title!r} is already on loan\")\n        book.on_loan = True\n        return book\n    def available(self, genre: str | None = None):\n        return (b for b in self.books.values() if not b.on_loan and genre in (None, b.genre))\n    def genre_counts(self) -> Counter:\n        return Counter(b.genre for b in self.books.values())\nlib = Library()\nlib.add(Book(\"1\", \"Dune\", \"sci-fi\"), Book(\"2\", \"Emma\", \"classic\"), Book(\"3\", \"Neuromancer\", \"sci-fi\"))\nlib.lend(\"1\")\nfor isbn in [\"1\", \"9\"]:\n    try:\n        lib.lend(isbn)\n    except LibraryError as err:\n        print(\"error:\", err)\nprint([b.title for b in lib.available()])\nprint([b.title for b in lib.available(\"sci-fi\")])\nprint(lib.genre_counts().most_common())",
  "output": "error: 'Dune' is already on loan\nerror: unknown ISBN 9\n['Emma', 'Neuromancer']\n['Neuromancer']\n[('sci-fi', 2), ('classic', 1)]",
  "lines": [
   {
    "line": 3,
    "explanation": "A domain-specific error type: callers can catch library problems specifically."
   },
   {
    "line": 14,
    "explanation": "*books accepts any number of books in one call."
   },
   {
    "line": 18,
    "explanation": ".get returns None for a missing key, which is turned into a clear error."
   },
   {
    "line": 25,
    "explanation": "Returns a generator expression, so callers can loop, list it, or stop early."
   },
   {
    "line": 27,
    "explanation": "Counter summarises the collection in one line."
   },
   {
    "line": 32,
    "explanation": "Lending Dune again and lending an unknown ISBN both raise LibraryError, which is reported without crashing."
   }
  ],
  "tryIt": "Add a give_back(isbn) method that raises LibraryError if the book isn't on loan. Return Dune, then print the available titles again.",
  "hint": "Mirror lend: look the book up, raise if it's missing or not on loan, otherwise set on_loan = False.",
  "solution": "from dataclasses import dataclass\nclass LibraryError(Exception):\n    pass\n@dataclass\nclass Book:\n    isbn: str\n    title: str\n    on_loan: bool = False\nclass Library:\n    def __init__(self):\n        self.books = {}\n    def add(self, *books):\n        for b in books:\n            self.books[b.isbn] = b\n    def lend(self, isbn):\n        self.books[isbn].on_loan = True\n    def give_back(self, isbn):\n        book = self.books.get(isbn)\n        if book is None or not book.on_loan:\n            raise LibraryError(f\"{isbn} is not on loan\")\n        book.on_loan = False\n    def available(self):\n        return (b for b in self.books.values() if not b.on_loan)\nlib = Library()\nlib.add(Book(\"1\", \"Dune\"), Book(\"2\", \"Emma\"))\nlib.lend(\"1\")\nprint([b.title for b in lib.available()])\nlib.give_back(\"1\")\nprint([b.title for b in lib.available()])",
  "solutionOutput": "['Emma']\n['Dune', 'Emma']",
  "pitfall": "available() returns a generator: if you store it and loop over it twice, the second loop is empty. Call the method again, or wrap it in list() when you need the results more than once.",
  "check": {
   "question": "Why does lend raise LibraryError instead of returning None for an unknown ISBN?",
   "choices": [
    "Exceptions are faster",
    "Callers can't silently ignore the failure",
    "Dataclasses require it"
   ],
   "answer": 1,
   "why": "A None result is easy to forget to check. An exception forces the caller to handle the failure, or it stops the program."
  }
 }
];
