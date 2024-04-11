import multiprocessing

name = "todo"
loglevel = "info"
errorlog = "-"
accesslog = "-"

workers = multiprocessing.cpu_count() * 2

preload_app = True

reload = True
timeout = 300
