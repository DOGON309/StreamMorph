import sqlite3

from looptext import LoopText

dbname = "database.db"

class Database:
    def __init__(self):
        self.conn = sqlite3.connect(dbname)
        self.cur = self.conn.cursor()
        self._create_database()

    def _create_database(self):
        self.cur.execute("CREATE TABLE IF NOT EXISTS looptext (id TEXT PRIMARY KEY, content TEXT)")
        self.conn.commit()

    def add_looptext(self, looptext: LoopText):
        self.cur.execute("INSERT INTO looptext (id, content) VALUES (?, ?)", (looptext.id, looptext.content))
        self.conn.commit()
        self.close()
    
    def get_all_looptexts(self):
        self.cur.execute("SELECT * FROM looptext")
        looptexts = []
        for looptext in self.cur.fetchall():
            looptexts.append(LoopText(looptext[0], looptext[1]))
        self.close()
        return looptexts
    
    def update_looptext(self, looptext: LoopText):
        self.cur.execute("UPDATE looptext SET content=? WHERE id=?", (looptext.content, looptext.id))
        self.conn.commit()
        self.close()
    
    def delete_looptext(self, looptext: LoopText):
        self.cur.execute("DELETE FROM looptext WHERE id=?", (looptext.id,))
        self.conn.commit()
        self.close()

    def close(self):
        self.conn.close()