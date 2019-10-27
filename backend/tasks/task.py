import functools
from typing import Callable

from backend.wiring import Wiring


def task(func: Callable):
    # Достаём имена аргументов функции:
    varnames = func.__code__.co_varnames

    @functools.wraps(func)
    def result(*args, **kwargs):
        # Достаём вайринг. Используем .pop(), потому что мы не
        # хотим, чтобы у тасок был доступ ко всему вайрингу.
        wiring: Wiring = kwargs.pop("wiring")
        wired_objects_by_name = wiring.__dict__
        for arg_name in varnames:
            if arg_name in wired_objects_by_name:
                kwargs[arg_name] = wired_objects_by_name[arg_name]
            # Здесь могло бы быть получение объекта из вайринга по
            # аннотации типа аргумента, но как-нибудь в другой раз.
        return func(*args, **kwargs)

    return result
