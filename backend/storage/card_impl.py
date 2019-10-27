from typing import Iterable
import bson
import bson.errors

from pymongo.collection import Collection
from pymongo.database import Database

from backend.storage.card import Card, CardDAO, CardNotFound


class MongoCardDAO(CardDAO):

    def __init__(self, mongo_database: Database):
        self.mongo_database = mongo_database
        # Очевидно, slug должны быть уникальны.
        self.collection.create_index("slug", unique=True)

    @property
    def collection(self) -> Collection:
        return self.mongo_database["cards"]

    @classmethod
    def to_bson(cls, card: Card):
        # MongoDB хранит документы в формате BSON. Здесь
        # мы должны сконвертировать нашу карточку в BSON-
        # сериализуемый объект, что бы в ней ни хранилось.
        result = {
            k: v
            for k, v in card.__dict__.items()
            if v is not None
        }
        if "id" in result:
            result["_id"] = bson.ObjectId(result.pop("id"))
        return result

    @classmethod
    def from_bson(cls, document) -> Card:
        # С другой стороны, мы хотим абстрагировать весь
        # остальной код от того факта, что мы храним карточки
        # в монге. Но при этом id будет неизбежно везде
        # использоваться, так что сконвертируем-ка его в строку.
        document["id"] = str(document.pop("_id"))
        return Card(**document)

    def create(self, card: Card) -> Card:
        card.id = str(self.collection.insert_one(self.to_bson(card)).inserted_id)
        return card

    def update(self, card: Card) -> Card:
        card_id = bson.ObjectId(card.id)
        self.collection.update_one({"_id": card_id}, {"$set": self.to_bson(card)})
        return card

    def get_all(self) -> Iterable[Card]:
        for document in self.collection.find():
            yield self.from_bson(document)

    def get_by_id(self, card_id: str) -> Card:
        return self._get_by_query({"_id": bson.ObjectId(card_id)})

    def get_by_slug(self, slug: str) -> Card:
        return self._get_by_query({"slug": slug})

    def _get_by_query(self, query) -> Card:
        document = self.collection.find_one(query)
        if document is None:
            raise CardNotFound()
        return self.from_bson(document)
