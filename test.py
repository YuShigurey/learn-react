from typing import Callable

a: Callable[[int], int]

f: a

def g(a: int) -> str:
    return 0

f = g