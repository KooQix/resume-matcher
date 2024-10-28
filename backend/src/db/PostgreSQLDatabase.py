from contextlib import contextmanager
import psycopg2
import os

import psycopg2.pool
from psycopg2.extras import RealDictCursor


class PostgreSQLDatabase:
    _connection_pool = None

    @classmethod
    def initialize(cls, minconn: int, maxconn: int):
        """Initialize the connection pool."""

        assert minconn <= maxconn, "minconn must be less than or equal to maxconn"

        cls._connection_pool = psycopg2.pool.SimpleConnectionPool(
            minconn,
            maxconn,
            host=os.environ.get('DB_HOST'),
            user=os.environ.get('DB_USER'),
            password=os.environ.get('DB_PASS'),
            dbname=os.environ.get('DB_NAME')
        )

    @classmethod
    def get_connection(cls):
        """Get a connection from the pool."""
        if cls._connection_pool is None:
            raise Exception("Connection pool is not initialized.")
        return cls._connection_pool.getconn()

    @classmethod
    def return_connection(cls, connection):
        """Return a connection to the pool."""
        cls._connection_pool.putconn(connection)

    @classmethod
    def close_all_connections(cls):
        """Close all connections in the pool."""
        if cls._connection_pool:
            cls._connection_pool.closeall()

    @staticmethod
    @contextmanager
    def get_cursor(commit=False):
        """Provide a transactional scope around a series of operations."""
        connection = PostgreSQLDatabase.get_connection()
        try:
            # Create cursor with cursor factory so that it returns a dictionary {column_name: value}
            cursor = connection.cursor(cursor_factory=RealDictCursor)
            yield cursor
            if commit:
                connection.commit()
        except Exception as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            PostgreSQLDatabase.return_connection(connection)
