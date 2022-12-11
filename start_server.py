import contextlib
from http.server import *
import socket
from concurrent.futures import ThreadPoolExecutor
import webbrowser


def is_port_in_use(port: int) -> bool:
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def serve(directory, port=8000):

    handler_class = SimpleHTTPRequestHandler

    if is_port_in_use(port):
        input(f"port {port} is in use, skipped. Press enter to continue...")
        return

    # webbrowser.open(f"http://127.0.0.1:{port}/")

    class DualStackServer(ThreadingHTTPServer):

        def server_bind(self):
            # suppress exception when protocol is IPv4
            with contextlib.suppress(Exception):
                self.socket.setsockopt(
                    socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
            return super().server_bind()

        def finish_request(self, request, client_address):
            self.RequestHandlerClass(request, client_address, self,
                                        directory=directory)


    with DualStackServer(("127.0.0.1", port), handler_class) as httpd:
        host, port = httpd.socket.getsockname()[:2]
        url_host = f'[{host}]' if ':' in host else host
        print(
            f"Serving HTTP on {host} port {port} "
            f"(http://{url_host}:{port}/) ..."
        )
        try:
            with ThreadPoolExecutor(max_workers=2) as executor:
                executor.submit(httpd.serve_forever)
                executor.submit(webbrowser.open, (f"http://127.0.0.1:{port}/"))
                input(f"Press enter to shutdown server and continue...")
                httpd.shutdown()
                executor.shutdown()

        except KeyboardInterrupt:
            print("\nKeyboard interrupt received, exiting.")
            # sys.exit(0)


if __name__ == "__main__":
    serve("./build")

